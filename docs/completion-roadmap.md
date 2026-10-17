# Relicto — Site Completion Roadmap & Execution Progress

This document serves as the master execution tracker for bringing **Relicto** from its current feature-complete development baseline to full production deployment.

---

## Progress Overview

| Phase / Milestone | Status | Focus Area | Key Deliverables |
| :--- | :---: | :--- | :--- |
| **Foundations & Core Domains** | ✅ Complete | Mocks → Postgres DB | Auth, Marketplace, Orders, Escrow, Tournaments, Community, Mobile Parity (23 migrations) |
| **Milestone 1: Financial Hardening** | ✅ Complete | Wallet & Bids | Bid Escrow Holds, Overcommitment Protection, Uncommitted Liquidity Sync |
| **Milestone 2: Collection Trade-Ups** | 🟡 Next Up | CS2 Trade-Up Engine | Canonical Weapon Collections, Dynamic Odds Matrix, Wear Float Transfer |
| **Milestone 3: Unique Catalog Art** | ⏳ Queued | Catalog Media Depth | Elimination of repeating item shots, authentic game renders for all 162 items |
| **Milestone 4: Live Payment Rails** | ⏳ Queued | Fiat & Crypto Gateways | Stripe Checkout Session webhook, Web3 Crypto payment listener, Vault auto-credit |
| **Milestone 5: Steam Trade Daemon** | ⏳ Queued | Physical Asset Bots | Worker daemon architecture connecting `/api/escrow/events` to real Steam trade sessions |

---

## Milestone 1: Financial Integrity — Bid Escrow Holds & Balance Protection ✅ Done

### Objectives
Currently, incoming buyer bids verify vault liquidity at placement and only debit upon seller acceptance. If a trader places multiple bids across different listings or spends their balance on checkout, an accepted bid can fail as `buyer-short`. 

### Execution Tasks:
1. **Uncommitted Liquid Balance Tracking**:
   - Calculate total committed funds locked in active pending bids (`status = 'pending'` and `expiresAt > now()`).
   - Derive `uncommittedCents = balanceCents - activeBidHoldsCents`.
2. **Bid Placement & Revision Enforcement**:
   - In `makeOffer` ([offers.commands.ts](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/offers/offers.commands.ts)): Ensure buyer's uncommitted balance covers new bids or the incremental delta on revisions.
   - Prevent placing bids that exceed available uncommitted vault liquidity.
3. **Cart Checkout & Cashout Coordination**:
   - Ensure checkout payments and instant cashouts respect uncommitted balances or release open bids if explicitly requested.
4. **Acceptance Guarantee**:
   - Once a seller accepts an offer, the buyer's funds are guaranteed to be present, eliminating `buyer-short` failures.
5. **Wallet Metrics Display**:
   - Reflect committed bid funds clearly in desktop and mobile treasury metrics without breaking UI types.

---

## Milestone 2: Authentic CS2 Weapon Collections for Trade-Up Chamber

### Objectives
The Trade-Up Chamber currently draws from a generic per-game outcome pool. In Counter-Strike 2, trade-up contracts require items from specific collections and calculate outcomes dynamically from the next tier of those exact collections.

### Execution Tasks:
1. **Schema Extension**:
   - Add `collection` / `collection_id` to `items` table (e.g. *Cobblestone*, *The Dust 2 Collection*, *Dreams & Nightmares*).
2. **Dynamic Outcome Odds Engine**:
   - Parse the 10 committed input items in the forge deck.
   - For each input item from Collection $C$, identify all available weapons of the next rarity grade in $C$.
   - Calculate exact mathematical probabilities proportional to the number of eligible outcomes per collection.
3. **Float & Wear Inheritance**:
   - Apply CS2 formula: $\text{Outcome Float} = (\text{Avg Input Float} \times (\text{Max Float} - \text{Min Float})) + \text{Min Float}$.
4. **Seed Enrichment**:
   - Tag catalog items with authentic CS2 collection metadata.

---

## Milestone 3: Catalog Media Depth & Unique Artwork

### Objectives
All 162 catalog items resolve without error, but 144 generated items share 8 fallback images.

### Execution Tasks:
1. Map high-fidelity SVG/PNG icons and skin renders per hero, weapon class, and exterior wear.
2. Update seed scripts to associate unique visual assets to all catalog records.

---

## Milestone 4: Production Payment Gateways

### Objectives
Transition from test-mode payments (`CHECKOUT_MOCK_PAYMENTS`) to live financial rails.

### Execution Tasks:
1. **Stripe Integration**:
   - Implement `/api/webhooks/stripe` with signature verification.
   - Settle card deposits directly into `walletAccounts` and create `ledgerEntries` with `venue = 'stripe'`.
2. **Web3 Crypto Gateways**:
   - Implement address generation and transaction confirmation listeners for USDT (TRC20/ERC20) and BTC/ETH.

---

## Milestone 5: Autonomous Steam Trade Bot Daemon

### Objectives
Automate the physical delivery of items between buyers, sellers, and Relicto Sentinel Bots.

### Execution Tasks:
1. Standardize Steam Trade Offer Manager queue.
2. Dispatch trade offers when escrow orders transition to `bot_dispatched`.
3. Post status webhooks back to `/api/escrow/events` (`offer_sent`, `delivered`, `cancelled`).
