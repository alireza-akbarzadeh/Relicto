# Phase 4 — Authorization, Permissions & Access Control Report

**Application:** Relicto  
**Audit Phase:** Phase 4 — Authorization, Permissions, and Access Control  
**Date:** November 2026  
**Status:** Completed & Verified  

---

## 1. Executive Summary

Phase 4 evaluated the server-side access control models, Insecure Direct Object References (IDOR / BOLA), Broken Function-Level Authorization (BFLA), role enforcement, and mutation permissions.

### Key Outcomes:
- **Critical Broken Function-Level Authorization Remediated on Chest Management (CWE-285 / CWE-862):** `/api/chests/[slug]` previously implemented `PUT` and `DELETE` HTTP methods with zero authentication and zero role checks, allowing any anonymous internet user to alter chest drop odds, coin costs, or permanently delete platform loot chests. An authoritative server guard [`requireAdminRole()`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/auth/auth.guard.ts) was created and attached to both handlers, requiring verified database profile role `Admin`.
- **Admin Gateway Route Protection Enforced:** [`src/app/admin/page.tsx`](file:///c:/Users/akbarzadeh.ali/Relicto/src/app/admin/page.tsx) was fortified with server-side `requireAdminRole()`. Unauthenticated requests redirect to `/sign-in?next=/admin`, and authenticated non-admin traders trigger Next.js's native `forbidden()` error boundary (`src/app/forbidden.tsx`).
- **Critical Webhook Execution Vulnerability Remediated (SEC-004 / CWE-306):** In [`src/app/api/webhooks/crypto/route.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/app/api/webhooks/crypto/route.ts), if `CRYPTO_WEBHOOK_SECRET` was unconfigured in the environment, the bearer token check evaluated to true, allowing anyone to POST arbitrary wallet credits. The route was changed to fail closed with `503 Service Unavailable` if the secret is unset, and strictly enforces constant-time bearer validation when configured.
- **Insecure Direct Object Reference (IDOR) Assessment on Orders & Listings: SECURE.**
  - `orders` tracking queries in `src/server/modules/orders/tracking.repository.ts` strictly enforce `or(eq(orders.buyerId, viewerId), eq(orders.sellerId, viewerId))`. Counterparties cannot view unassociated orders.
  - `sell.commands.ts` strictly asserts ownership on inventory listing mutations (`eq(inventoryItems.userId, userId)`) and listing cancellations (`eq(listings.sellerId, userId)`).
- **All Automated Tests Passed:** Phase 1, Phase 2, Phase 3, Phase 4 (`scripts/test-phase4-authorization.mts`), and platform E2E suite passed with 100% success.

---

## 2. Findings & Threat Analysis

### Finding SEC-019: Broken Function-Level Authorization on Chest Mutations (CWE-285 / CWE-862)
- **Severity:** **Critical**
- **Affected File:** `src/app/api/chests/[slug]/route.ts` (`PUT`, `DELETE`)
- **Evidence:**
  ```typescript
  // Before: Completely unauthenticated
  export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const body = await req.json();
    chestsService.adminUpdateChest(slug, body);
    return NextResponse.json({ success: true });
  }

  export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    chestsService.adminDeleteChest(slug);
    return NextResponse.json({ success: true });
  }
  ```
- **Impact:** An attacker could craft an HTTP `PUT /api/chests/dota2-ti14-immortal` request to change chest coin prices to `0` or drop rates of rare items to `100%`, or send `DELETE /api/chests/<slug>` to wipe out chests from the platform.
- **Remediation:** Injected `requireAdminRole()` server guard into both handlers. If the user is unauthenticated, the server returns `401 Unauthorized`. If the user is authenticated but lacks the `Admin` role in the database `profiles` table, the server returns `403 Forbidden`.
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-004: Unauthenticated Crypto Webhook Execution on Missing Secret (CWE-306 / CWE-862)
- **Severity:** **Critical**
- **Affected File:** `src/app/api/webhooks/crypto/route.ts`
- **Evidence:**
  ```typescript
  // Before:
  const secret = process.env.CRYPTO_WEBHOOK_SECRET;
  if (secret && !bearerMatches(authHeader, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  ```
  If `CRYPTO_WEBHOOK_SECRET` was empty or undefined, `if (secret && ...)` was bypassed entirely, allowing unauthenticated requests to reach `verifyAndSettleCryptoDeposit` and deposit arbitrary funds into any user's balance.
- **Remediation:** Modified logic to fail closed:
  ```typescript
  if (!secret) {
    return NextResponse.json({ error: "crypto_webhook_unconfigured" }, { status: 503 });
  }
  if (!bearerMatches(authHeader, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  ```
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-020: Unprotected Administrative Route Gateway (CWE-862)
- **Severity:** **Medium**
- **Affected File:** `src/app/admin/page.tsx`
- **Evidence:** `/admin` previously performed an unconditional redirect to `/dashboard` without inspecting if the caller was signed in or held administrative privileges.
- **Remediation:** Integrated `requireAdminRole()` server guard. Unauthenticated visitors are redirected to `/sign-in?next=/admin`, and non-admin authenticated users trigger Next.js's `forbidden()` response boundary.
- **Status:** **FIXED & VERIFIED**.

---

## 3. Modified & Created Files

1. [`src/server/modules/auth/auth.guard.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/auth/auth.guard.ts): **New.** Authoritative database profile role verifier `requireAdminRole()`.
2. [`src/app/api/chests/[slug]/route.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/app/api/chests/[slug]/route.ts): Protected `PUT` and `DELETE` endpoints with `requireAdminRole()`.
3. [`src/app/admin/page.tsx`](file:///c:/Users/akbarzadeh.ali/Relicto/src/app/admin/page.tsx): Protected admin route with `requireAdminRole()` and `forbidden()`.
4. [`src/app/api/webhooks/crypto/route.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/app/api/webhooks/crypto/route.ts): Secured crypto webhook against unconfigured secret bypass.
5. [`scripts/test-phase4-authorization.mts`](file:///c:/Users/akbarzadeh.ali/Relicto/scripts/test-phase4-authorization.mts): **New.** Automated test suite for Phase 4.

---

## 4. Verification & Test Results

1. **Phase 4 Authorization Test Suite:**
   ```bash
   npx tsx --env-file=.env.local --conditions=react-server scripts/test-phase4-authorization.mts
   ```
   - Server-side `requireAdminRole` guard: **PASSED (Unauthenticated rejected with 401)**
   - `PUT /api/chests/[slug]` BFLA protection: **PASSED (Blocked with 401)**
   - `DELETE /api/chests/[slug]` BFLA protection: **PASSED (Blocked with 401)**
   - Crypto Webhook Authorization (SEC-004): **PASSED (Fails closed with 503 when unset, rejects invalid bearer with 401)**

2. **Previous Phases Regression:**
   - Phase 1 (Frontend): **PASSED**
   - Phase 2 (Headers): **PASSED**
   - Phase 3 (Auth): **PASSED**

3. **Platform E2E Suite:**
   ```bash
   npm run test:e2e
   ```
   - **PASSED (100% success across all 7 milestones)**

