# Phase 11: Business Logic & Transaction Security — Audit & Hardening Report

**Execution Date:** November 2026  
**Status:** COMPLETE & VERIFIED (6/6 Phase Tests Passed, 100% Full Regression Passing)  
**Security Reference:** `security.md` (Phase 11 — Business Logic and Transaction Security)

---

## 1. Executive Summary

Phase 11 audits and hardens Relicto against attacks that exploit legitimate application features in unintended ways. Business logic vulnerabilities cannot be detected by standard automated DAST/SAST scanners because the attacks conform to syntactically valid inputs while violating platform invariants, economic rules, state machine transitions, or transaction boundaries.

In Phase 11, we audited all critical financial, transactional, and state-transition workflows across the application:
1. Basket checkout, discount arithmetic, and promo application.
2. Escrow dispute and settlement state machines.
3. Wallet cashouts and committed auction/buy bid protections.
4. Chest loyalty rewards, coin economy, and unbox asset provenance.
5. CS2 trade-up contracts and item burning mechanics.

We identified and neutralized three high-impact business logic attack vectors:
- **Promo Discount Liquidity Drain:** Disallowed promo relief on micro-baskets below $20.00, preventing free item checkouts that drain treasury liquidity.
- **Infinite Daily Bonus Exploit:** Replaced untracked loyalty coin dispensing with a persistent 24-hour rate cooldown and streak state machine.
- **Premature Escrow Settlement:** Enforced an atomic trade dispatch invariant in `escrowService.delivered`, preventing order completion and seller payout before an authentic trade offer has been dispatched.

---

## 2. Sensitive Workflow Audit & Threat Modeling

| Workflow Surface | Code Location | Potential Abuse Vector | Impact / Severity | Hardening Applied |
| :--- | :--- | :--- | :--- | :--- |
| **Basket Pricing & Discounts** | `src/modules/checkout/lib/pricing.ts` | Applying $15 tournament promo on items priced < $15 to acquire skins for $0, draining platform payout treasury | **HIGH** — Direct liquidity drain. | Enforced `PROMO_MIN_SUBTOTAL_CENTS` ($20.00 min basket value). |
| **Daily Bonus Claims** | `src/server/modules/chests/chests.service.ts` | Unconstrained repeated calls to `POST /api/chests/daily-bonus` awarding 100 coins infinitely | **HIGH** — Unlimited coin economy inflation. | Added persistent `DailyBonusRecord`, 24h lockout, and streak validation. |
| **Escrow Delivery Payout** | `src/server/modules/escrow/escrow.service.ts` | Invoking `delivered()` before the seller/bot dispatches the Steam trade offer | **CRITICAL** — Releasing buyer funds to seller without item delivery. | Added invariant: `!(await repo.hasDispatchedOffer(tx, order.id))` returns `"unchanged"`. |
| **Buyer Cancellation** | `src/server/modules/escrow/escrow.service.ts` | Buyer attempting to cancel order after seller has already dispatched trade offer | **HIGH** — Double-spend: receiving item in Steam while refunding vault. | Checked `hasDispatchedOffer()`: cancellation strictly refused (`status: "offer-sent"`). |
| **Escrow Dispute Freeze** | `src/server/modules/escrow/escrow.service.ts` | Tampering with frozen dispute state or automated expiry sweep cancelling active dispute | **HIGH** — Inconsistent escrow state transition. | `transition()` rejects non-escrow states; dispute freezes automated expiry sweep. |
| **Wallet Cashouts** | `src/server/modules/wallet/wallet.commands.ts` | Cashing out funds committed to active marketplace buy bids | **HIGH** — Unbacked bid commitments. | `sumCommittedBids()` deducted from spendable balance under row lock (`for("update")`). |
| **Chest Recycle** | `src/server/modules/chests/chests.service.ts` | Replaying unbox IDs or claiming coin credit for items won by another user | **HIGH** — Double-crediting and IDOR theft. | Provenance record checking: verifies owner ID, single redemption flag, and 24h window. |
| **Trade-Up Contracts** | `src/server/modules/trade-ups/trade-ups.commands.ts` | Mixing rarities, using unowned items, or reusing burned skins | **HIGH** — Duplication and invalid outcome odds. | Atomic burn: locks 10 owned skins of uniform grade, deletes inputs, and inserts won outcome in one transaction. |

---

## 3. Implementation Details

### 3.1. Discount Arithmetic Hardening (`pricing.ts`)

Modified [`src/modules/checkout/lib/pricing.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/checkout/lib/pricing.ts):
```ts
export const PROMO_MIN_SUBTOTAL_CENTS = 2000; // $20.00 minimum subtotal

export function quote(priceCents: number[], promo: boolean): Quote {
  const subtotalCents = sum(priceCents);
  const comboCents = priceCents.length >= COMBO_THRESHOLD ? COMBO_DISCOUNT_CENTS : 0;
  const promoCents = promo && subtotalCents >= PROMO_MIN_SUBTOTAL_CENTS ? PROMO_DISCOUNT_CENTS : 0;

  return {
    subtotalCents,
    comboCents,
    promoCents,
    dueCents: Math.max(0, subtotalCents - comboCents - promoCents),
  };
}
```
- Baskets below $20.00 cannot trigger promo relief.
- Penny-perfect proportional allocation (`allocate`) ensures zero rounding errors across item ledger lines.

### 3.2. Daily Loyalty Bonus State Machine (`chests.service.ts` & `chests.repository.ts`)

- Added `DailyBonusRecord` tracking `lastClaimAt` (epoch ms) and `streak` (integer).
- Added `getDailyBonusState(userId)`: computes cooldown remaining (`timeUntilNextClaimSec`), verifies if streak is active (< 48h) or reset, and determines eligibility.
- Updated `claimDailyBonus(userId)`:
  - If `canClaim === false`: rejects with informative error and returns 400.
  - If `canClaim === true`: updates timestamp, increments streak, credits coins, and locks out claims for 86,400 seconds.

### 3.3. Escrow State Invariant Defense (`escrow.service.ts`)

Added dispatch verification in `escrowService.delivered`:
```ts
delivered(code: string) {
  return transition(code, async (tx, locked) => {
    const { order, line } = locked;
    if (!(await repo.hasDispatchedOffer(tx, order.id))) return "unchanged";
    // ... proceed with payout release
  });
}
```

---

## 4. Verification & Testing

### 4.1. Phase 11 Test Suite (`scripts/test-phase11-business-logic.mts`)

Automated tests covering all business logic invariants:
1. `quote`: Rejects promo relief when basket subtotal is below $20.00 threshold ($10 basket -> $0 promo).
2. `quote`: Correctly applies combo and promo discounts on valid baskets and floors `dueCents` at 0.
3. `allocate`: Preserves exact discount sum across proportional line shares without loss of cents.
4. `claimDailyBonus`: Grants initial reward, advances streak, and strictly rejects duplicate claim within 24h.
5. `recycleWonItem`: Enforces single-redemption invariant, rejecting replayed unbox IDs and cross-user IDOR attempts.
6. `escrowService.delivered`: Rejects premature delivery execution when trade offer is not dispatched.

**Result: 6 / 6 tests passed (100%).**

### 4.2. Full Regression Suite

Executed complete test suite across Phases 1 through 11 and the end-to-end milestone suite with 100% passing results.

