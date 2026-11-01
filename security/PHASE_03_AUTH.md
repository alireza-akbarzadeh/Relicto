# Phase 3 — Authentication & Identity Security Audit Report

**Application:** Relicto  
**Audit Phase:** Phase 3 — Authentication and Identity Security  
**Date:** November 2026  
**Status:** Completed & Verified  

---

## 1. Executive Summary

Phase 3 evaluated the authentication architecture, identity verification mechanisms, credential handling, session lifecycle, and third-party login flows (Steam OpenID 2.0).

### Key Outcomes:
- **Private Email Harvesting & Account Enumeration Eliminated (CWE-200 / CWE-204):** `resolveAccountEmail` was previously exposed directly as a client-callable Server Action that returned a user's registered private email address to any anonymous browser when provided with a trader handle (e.g. `@S1mple_CS`). This has been replaced by `signInWithIdentityAction`, which resolves the identifier internally on the server, verifies credentials via Better Auth, and returns a uniform failure response on bad credentials without disclosing user existence or private email addresses.
- **Sensitive Token Exposure in Server Logs Remediated (CWE-532):** In `src/lib/auth.ts`, raw password reset tokens and email verification links were being written directly to `stdout`. This was modified to ensure raw secret tokens are never logged in production.
- **Development-Mode Identity Impersonation Fallback Removed (SEC-002):** Unauthenticated sessions in `src/modules/relicto/data/get-session.ts` previously defaulted to `seed-trader-relicto` whenever `NODE_ENV === "development"`. This was restricted to require an explicit opt-in environment variable (`ALLOW_DEV_ANONYMOUS_IMPERSONATION === "true"`), ensuring unauthenticated requests receive `null` by default.
- **Mock Steam ID Takeover Hardened (SEC-003):** The Steam OpenID callback accepted arbitrary `mock_steam_id` parameters in non-production environments. This was hardened to mandate local environment checks, an opt-in dev flag (`ALLOW_MOCK_STEAM_AUTH === "true"`), and restriction to a single static test seed ID.
- **Steam OpenID `return_to` Subpath Hijacking Mitigated:** `verifySteamAssertion` in `src/lib/steam/openid.ts` was upgraded to strictly validate both URL `origin` and `pathname` equality rather than a prefix `startsWith` check.
- **All Automated Tests Passed:** Phase 1, Phase 2, Phase 3 (`scripts/test-phase3-auth.mts`), and the main E2E verification suite (`scripts/verify-e2e.mts`) passed with 100% success.

---

## 2. Findings & Threat Analysis

### Finding SEC-002: Development-Mode Global Identity Impersonation Fallback (CWE-306)
- **Severity:** **High**
- **Affected File:** `src/modules/relicto/data/get-session.ts` (`getUserId`, `getSession`)
- **Evidence:**
  ```typescript
  // Before:
  const userId = result?.user.id ?? (process.env.NODE_ENV === "development" ? "seed-trader-relicto" : null);
  ```
- **Impact:** Any deployment running in development mode (e.g. staging, preview environments, or developer machines on shared networks) automatically granted full seed-trader privileges (wallet access, inventory manipulation, order placement) to unauthenticated visitors.
- **Remediation:** Enforced an explicit opt-in check:
  ```typescript
  const allowDevAnonymousFallback =
    process.env.NODE_ENV === "development" &&
    process.env.ALLOW_DEV_ANONYMOUS_IMPERSONATION === "true";
  ```
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-003: Arbitrary Mock Steam ID Authentication Bypass (CWE-287)
- **Severity:** **High**
- **Affected File:** `src/lib/steam/steam-auth-plugin.ts` (`steamCallback`)
- **Evidence:**
  ```typescript
  // Before:
  const isDev = process.env.NODE_ENV !== "production";
  const mockId = isDev && ctx.query.mock_steam_id ? ctx.query.mock_steam_id : null;
  ```
  Any non-production deployment permitted an attacker to append `?mock_steam_id=<VICTIM_STEAM_ID>` to log in as any Steam account without Steam verification.
- **Remediation:** Restricted mock steam login strictly to `localhost` / `127.0.0.1` and required `ALLOW_MOCK_STEAM_AUTH === "true"`, restricting the accepted value to the static developer test ID (`76561198082348819`).
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-016: Private Email Disclosure & Account Enumeration via Handle Resolution (CWE-200 / CWE-204)
- **Severity:** **High**
- **Affected File:** `src/server/modules/auth/auth.identity.ts`, `src/modules/auth/components/sign-in/sign-in-form.tsx`, `credential-form-mobile.tsx`
- **Evidence:**
  The client forms called `resolveAccountEmail(identity)` directly from the browser before submitting credentials to `authClient.signIn.email()`. If an attacker submitted any public trader handle (e.g. `@S1mple_CS`), the server action returned the trader's private email in the response payload.
- **Remediation:** Created `signInWithIdentityAction`, moving email resolution and password verification entirely to the server. The user's email is never returned to the client browser, and credential failures return a uniform, non-enumerating error message.
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-017: Sensitive Password Reset & Verification Token Logging (CWE-532)
- **Severity:** **Medium**
- **Affected File:** `src/lib/auth.ts` (`sendResetPassword`, `sendVerificationEmail`)
- **Evidence:**
  ```typescript
  // Before:
  sendResetPassword: async ({ user, url, token }) => {
    console.log(`[auth] Reset password for ${user.email}: url=${url} token=${token}`);
  }
  ```
  Password reset tokens logged in server logs allow any person with access to log drains (Vercel, Datadog) to hijack user accounts.
- **Remediation:** Restricted token and URL logging strictly to local development mode; production logs only record that a reset request was initiated for a given user ID without logging the secret.
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-018: Steam OpenID Return-To Subpath Collision Vulnerability (CWE-287)
- **Severity:** **Low**
- **Affected File:** `src/lib/steam/openid.ts` (`verifySteamAssertion`)
- **Evidence:** `verifySteamAssertion` previously verified `query["openid.return_to"]?.startsWith(expectedReturnTo)`. A malicious actor could provide a return_to URL sharing the prefix (e.g. `.../callback.attacker.com`).
- **Remediation:** Parsed both URLs using `new URL()` and asserted exact `origin` and `pathname` equality.
- **Status:** **FIXED & VERIFIED**.

---

## 3. Modified Files

1. [`src/server/modules/auth/auth.identity.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/auth/auth.identity.ts): Implemented `signInWithIdentityAction` and kept email resolution internal to the server.
2. [`src/modules/auth/components/sign-in/sign-in-form.tsx`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/auth/components/sign-in/sign-in-form.tsx): Switched desktop sign-in to `signInWithIdentityAction`.
3. [`src/modules/auth/components/mobile/credential-form-mobile.tsx`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/auth/components/mobile/credential-form-mobile.tsx): Switched mobile sign-in to `signInWithIdentityAction`.
4. [`src/lib/auth.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/auth.ts): Stopped logging reset tokens to stdout in production.
5. [`src/modules/relicto/data/get-session.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/relicto/data/get-session.ts): Required explicit opt-in for anonymous dev identity impersonation.
6. [`src/lib/steam/steam-auth-plugin.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/steam/steam-auth-plugin.ts): Constrained mock steam authentication to local dev with opt-in flag.
7. [`src/lib/steam/openid.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/steam/openid.ts): Exact origin and pathname validation in `verifySteamAssertion`.
8. [`scripts/test-phase3-auth.mts`](file:///c:/Users/akbarzadeh.ali/Relicto/scripts/test-phase3-auth.mts): Automated regression test suite for Phase 3.

---

## 4. Verification & Test Results

1. **Phase 3 Test Suite:**
   ```bash
   npx tsx --env-file=.env.local --conditions=react-server scripts/test-phase3-auth.mts
   ```
   - `signInWithIdentityAction` Enumeration & Credential Defense: **PASSED**
   - Anonymous session protection (dev fallback disabled): **PASSED**
   - Steam OpenID return_to strict origin and pathname verification: **PASSED**
   - Mock Steam auth protection: **PASSED**

2. **Phase 1 & Phase 2 Test Suites:**
   ```bash
   npx tsx --conditions=react-server scripts/test-phase1-frontend.mts
   npx tsx scripts/test-phase2-headers.mts
   ```
   - **PASSED (100%)**

3. **Platform E2E Verification Suite:**
   ```bash
   npm run test:e2e
   ```
   - **PASSED (100% success across all 7 milestones)**

