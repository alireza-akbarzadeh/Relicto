# Phase 1 — Frontend and Browser Security Audit Report

**Application:** Relicto  
**Audit Phase:** Phase 1 — Frontend and Browser Security  
**Date:** November 2026  
**Status:** Completed & Verified  

---

## 1. Executive Summary

Phase 1 evaluated the client-side attack surface, browser storage practices, DOM manipulation, client-to-server trust boundaries, and URL navigation.

### Key Outcomes:
- **XSS Posture:** **Robust.** The application has 0 occurrences of `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, or raw script injection. React 19 automatic JSX text node encoding safeguards all user-generated content, item names, descriptions, and copilot chat messages.
- **Browser Storage Posture:** **Secure.** `localStorage` only retains benign user preferences (`relicto_sound_muted`, `relicto_theme`). No session tokens, JWTs, credentials, or PII are stored in client-side Web Storage. Authentication relies on HttpOnly cookies (`better-auth.session_token`).
- **Open Redirects Discovered & Fixed:** A confirmed Open Redirect vulnerability (CWE-601) in Steam OpenID callback resolution (`safeCallback`) was discovered and remediated with same-origin URL parser enforcement.
- **Transport Security Hardened:** Steam Trade URL validation was upgraded to strictly mandate `https://`, preventing token interception over plaintext `http://`.
- **Server Action Runtime Boundary Secured:** `setLocaleAction` was hardened with runtime whitelist validation against arbitrary client payloads.
- **Verification:** Custom automated regression suite (`scripts/test-phase1-frontend.mts`) passed 100%, and the platform E2E verification suite (`scripts/verify-e2e.mts`) passed 100%.

---

## 2. Findings & Threat Analysis

### Finding SEC-010: Open Redirect Vulnerability in Steam OpenID Callback (CWE-601)
- **Severity:** **High**
- **Affected File:** `src/lib/steam/openid.ts` (`safeCallback`)
- **Preconditions:** An attacker crafts a Steam login URL with a malicious callback parameter: `/api/auth/steam/sign-in?callbackURL=/\attacker.com`
- **Evidence:**
  ```typescript
  // Before: Vulnerable implementation
  export function safeCallback(value: string | undefined, fallback = "/marketplace") {
    return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
  }
  ```
  In Node.js and Chromium browsers, `new URL('/\\evil.com', 'http://localhost')` evaluates to `http://evil.com/`. Because the path starts with `/\`, it bypassed `startsWith("/")` and `!startsWith("//")`.
- **Impact:** Credential harvesting, OAuth assertion interception, or phishing. After authenticating with Steam, the user was redirected to the attacker's external domain.
- **Remediation:** Rewrote `safeCallback` to reject backslashes, non-slash prefixes, and protocol-relative slashes, and enforce same-origin validation via `new URL(candidate, dummyOrigin)`.
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-013: Open Redirect Hardening in Post-Authentication Navigation (CWE-601)
- **Severity:** **Low / Informational**
- **Affected File:** `src/modules/relicto/lib/sign-in-href.ts` (`safeNext`)
- **Evidence:** `safeNext` previously checked `!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")`, which was resistant to basic slashes but lacked origin verification against encoded or normalized path-traversal sequences.
- **Remediation:** Standardized `safeNext` with the same robust same-origin parser logic as `safeCallback`.
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-014: Plaintext HTTP Scheme Allowed in Steam Trade URLs (CWE-319)
- **Severity:** **Medium**
- **Affected File:** `src/lib/steam/trade-url.ts` (`STEAM_TRADE_URL_REGEX`)
- **Evidence:**
  ```typescript
  // Before:
  const STEAM_TRADE_URL_REGEX =
    /^https?:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=(\d+)&token=([a-zA-Z0-9_-]+)$/;
  ```
  The regex allowed `http://`, permitting traders to submit plaintext trade URLs. If clicked or dispatched over untrusted networks, the secret partner `token` could be sniffed by MitM attackers.
- **Remediation:** Updated regex to strictly require `https://`:
  ```typescript
  const STEAM_TRADE_URL_REGEX =
    /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=(\d+)&token=([a-zA-Z0-9_-]+)$/;
  ```
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-015: Missing Runtime Validation on Server Action Argument (CWE-20)
- **Severity:** **Low**
- **Affected File:** `src/modules/i18n/actions.ts` (`setLocaleAction`)
- **Evidence:**
  The server action signature `export async function setLocaleAction(locale: "en" | "fa")` relies only on compile-time TypeScript checks. At runtime, arbitrary JSON POST requests can supply illegal strings directly into `cookieStore.set("NEXT_LOCALE", locale)`.
- **Remediation:** Added runtime whitelist validation:
  ```typescript
  if (locale !== "en" && locale !== "fa") {
    return { ok: false, error: "invalid_locale" };
  }
  ```
- **Status:** **FIXED & VERIFIED**.

---

### Finding SEC-007 (Audit Note): Client-Side Trust Boundary in Item Recycling (CWE-602)
- **Severity:** **Critical**
- **Affected Components:**
  - `src/modules/chests/components/win-celebration-dialog.tsx`
  - `src/modules/chests/components/chest-opening-arena.tsx`
  - `src/app/api/chests/recycle/route.ts`
- **Observation:** The frontend celebration dialog passes `coinsValue` to `chest-opening-arena.tsx`, which POSTs `{ coinsValue }` directly to the server. The server credits this value without validating whether an unbox result actually occurred or was already redeemed.
- **Audit Decision:** This represents an architectural broken trust boundary. Because fixing this cleanly requires modifying the server-side unbox state machine and database ledger, it is tracked for full remediation under **Phase 5 (Input Validation)** and **Phase 11 (Business Logic)**.

---

## 3. List of Modified Files

1. [`src/lib/steam/openid.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/steam/openid.ts): Rewrote `safeCallback()` with strict URL parser validation.
2. [`src/modules/relicto/lib/sign-in-href.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/relicto/lib/sign-in-href.ts): Rewrote `safeNext()` with strict URL parser validation.
3. [`src/lib/steam/trade-url.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/steam/trade-url.ts): Enforced `https://` for Steam trade URLs.
4. [`src/modules/i18n/actions.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/i18n/actions.ts): Added runtime whitelist validation to `setLocaleAction`.
5. [`scripts/test-phase1-frontend.mts`](file:///c:/Users/akbarzadeh.ali/Relicto/scripts/test-phase1-frontend.mts): Created automated test suite covering all 4 fixes.

---

## 4. Verification & Test Results

1. **Phase 1 Security Suite:**
   ```bash
   npx tsx --conditions=react-server scripts/test-phase1-frontend.mts
   ```
   - `safeCallback` Open Redirect suite: **PASSED (11/11 attack vectors blocked)**
   - `safeNext` Open Redirect suite: **PASSED (11/11 attack vectors blocked)**
   - Steam Trade URL HTTPS requirement: **PASSED (HTTP & spoofed origins rejected)**
   - `setLocaleAction` runtime check: **PASSED (Illegal strings rejected)**

2. **Full Platform E2E Regression Suite:**
   ```bash
   npm run test:e2e
   ```
   - All 7 verification milestones **PASSED (100% success)**.

