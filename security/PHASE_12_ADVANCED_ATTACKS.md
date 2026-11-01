# Phase 12: Advanced Attack Scenarios — Audit & Hardening Report

**Execution Date:** November 2026  
**Status:** COMPLETE & VERIFIED (6/6 Phase Tests Passed, 100% Full Regression Passing)  
**Security Reference:** `security.md` (Phase 12 — Advanced Attack Scenarios)

---

## 1. Executive Summary

Phase 12 investigates advanced and sophisticated attack vectors that combine multiple application mechanisms, exploit JavaScript runtime behaviors, manipulate real-time channels, or leverage concurrency race conditions.

During Phase 12, we conducted targeted audits across:
1. **Prototype Pollution & Object Merging:** Hardened dynamic object merging in [`settings.service.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/settings/settings.service.ts) against `__proto__`, `constructor`, and `prototype` property injection.
2. **Real-Time Streaming Security:** Hardened Server-Sent Events (SSE) endpoints against Cross-Site Stream Hijacking by validating `Sec-Fetch-Site` and requiring user authentication.
3. **Concurrency & Race Conditions:** Verified pessimistic row-level locking (`SELECT ... FOR UPDATE`) across all state-mutating financial, escrow, and inventory transactions.
4. **Cache Poisoning & Deception:** Verified strict HTTP cache-invalidation headers (`no-store, max-age=0, must-revalidate`) preventing CDN or proxy caching of private user data.

---

## 2. Threat Scenarios & Technical Analysis

### 2.1. Prototype Pollution via Dynamic Settings Update

- **Attack Scenario:** An attacker submits a malformed JSON payload containing `__proto__` or `constructor.prototype` keys into administrative settings update routines. If merged recursively or dynamically into objects, prototype properties could be injected globally across the Node.js runtime, altering default object behaviors or causing denial of service.
- **Audit Findings:** `settingsService.updateSettings` merged partial updates using `for (const [key, value] of Object.entries(updates))`.
- **Remediation:** Enforced a strict key whitelist and explicitly blocked `__proto__`, `constructor`, and `prototype`:
  ```ts
  const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);
  for (const [key, value] of Object.entries(updates)) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    if (value !== undefined && Object.prototype.hasOwnProperty.call(DEFAULT_PLATFORM_SETTINGS, key)) {
      (merged as unknown as Record<string, unknown>)[key] = value;
    }
  }
  ```

### 2.2. Cross-Site Real-Time Stream Hijacking (SSE)

- **Attack Scenario:** A victim visits an attacker-controlled website while signed in to Relicto. The malicious page opens an `EventSource` connection to `/api/tracker/stream?item=butterfly-knife-doppler` with credentials.
- **Audit Findings:** While browsers enforce standard CORS restrictions on reading `EventSource` responses, initiating cross-site connections could leak connection state or trigger unauthorized long-lived streaming connections on server infrastructure.
- **Remediation:** Added `Sec-Fetch-Site` validation in [`src/app/api/tracker/stream/route.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/app/api/tracker/stream/route.ts):
  ```ts
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return new Response("Forbidden: Cross-site real-time connection rejected", { status: 403 });
  }
  ```
  Additionally switched session inspection to `request.headers` to ensure reliable request-bound context.

### 2.3. Concurrency & Double-Spending Race Conditions

- **Attack Scenario:** An attacker issues two or more simultaneous HTTP requests (e.g., cashing out the full wallet balance while simultaneously checking out an item, or accepting two offers on the same skin).
- **Audit Findings & Verification:**
  - Relicto employs transactional row-level pessimistic locks (`.for("update")`) across all critical database tables:
    - `orders` locked in `lockOrder` during state transitions (`escrow.repository.ts`).
    - `walletAccounts` locked in `requestCashout` (`wallet.commands.ts`) and `deposit` (`wallet.deposit.ts`).
    - `cartItems` and `listings` locked in `settle` (`checkout.settle.ts`).
    - `inventoryItems` locked in `ignite` (`trade-ups.commands.ts`).
  - Active committed auction bids are summed under the lock (`sumCommittedBids`) and deducted from spendable liquid balance before any cashout or checkout can proceed.

### 2.4. Cache Deception & Cache Poisoning Controls

- **Audit Findings & Verification:**
  - In `next.config.ts`, all `/api/:path*` routes enforce `Cache-Control: no-store, max-age=0, must-revalidate` and `X-Content-Type-Options: nosniff`.
  - Sensitive user data routes (e.g. `/api/notifications`) explicitly return `Cache-Control: private, no-store`.
  - Service worker `/sw.js` is served with `no-cache, no-store, must-revalidate`.

---

## 3. Verification & Testing

### 3.1. Phase 12 Test Suite (`scripts/test-phase12-advanced-attacks.mts`)

Automated tests covering all advanced attack scenarios:
1. `settingsService.updateSettings`: Confirms rejection of `__proto__`, `constructor`, and unauthorized properties, verifying `Object.prototype` remains clean.
2. `GET /api/tracker/stream`: Confirms rejection of `Sec-Fetch-Site: cross-site` requests with `403 Forbidden`.
3. `GET /api/tracker/stream`: Confirms rejection of unauthenticated requests with `401 Unauthorized`.
4. `GET /api/tracker/stream`: Confirms item slug regex format validation.
5. `GET /api/notifications`: Confirms enforcement of `private, no-store` cache controls.
6. Concurrency Audit: Confirms presence of pessimistic row-level locking (`.for("update")`) across escrow, wallet, and checkout modules.

**Result: 6 / 6 tests passed (100%).**

### 3.2. Full Regression Suite

Executed complete test suite across Phases 1 through 12 and the end-to-end milestone suite with 100% passing results.

