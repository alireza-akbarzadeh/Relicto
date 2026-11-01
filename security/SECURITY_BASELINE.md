# Initial Security Baseline & Audit Findings

**Application:** Relicto  
**Audit Phase:** Phase 0 — Project Discovery and Security Baseline  
**Date:** November 2026  
**Status:** Completed Baseline — Awaiting Phase 1 Authorization  

---

## 1. Executive Summary

During Phase 0 (Discovery & Baseline), a comprehensive structural and code-level inspection was performed across the Relicto codebase (`c:\Users\akbarzadeh.ali\Relicto`).

The application demonstrates strong architectural patterns in several areas (Next.js 16 App Router, TypeScript strictness, parameterized queries with Drizzle ORM, timing-safe bearer token verification for crons, and clean modular domain segregation). However, significant security vulnerabilities and hardening deficiencies were uncovered during this baseline inspection, particularly regarding missing HTTP security headers, development bypasses that affect identity, financial settlement fallback logic, and client-controlled inputs in financial and gaming endpoints.

---

## 2. Initial Inventory of Pre-Audit Findings

The following preliminary findings have been identified during Phase 0 inspection and mapped to their respective upcoming audit phases:

| Finding ID | Title | Preliminary Severity | Target Phase | Summary of Risk |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-001** | Missing Global HTTP Security Headers & Global CSP | **High** | Phase 2 | `next.config.ts` configures security headers only for `/sw.js`. The main application lacks `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`. |
| **SEC-002** | Development-Mode Global Identity Impersonation Fallback | **High** | Phase 3 | `src/modules/relicto/data/get-session.ts` automatically assigns `userId = "seed-trader-relicto"` when `NODE_ENV === "development"`, granting full account control to unauthenticated visitors if run on dev/staging servers. |
| **SEC-003** | Mock Steam ID Authentication Bypass in Non-Production | **High** | Phase 3 | `src/lib/steam/steam-auth-plugin.ts` accepts `?mock_steam_id=<id>` when not in production, allowing complete account takeover of any Steam account without Steam verification. |
| **SEC-004** | Unauthenticated Webhook Execution when Secret Unset | **Critical** | Phase 7 / 10 | In `src/app/api/webhooks/crypto/route.ts`, if `CRYPTO_WEBHOOK_SECRET` is unset, the auth check is bypassed entirely, allowing anyone to POST arbitrary deposits. |
| **SEC-005** | Direct Wallet Balance Credit on Unconfigured Stripe Mode | **Critical** | Phase 11 | In `src/app/api/wallet/stripe/create-session/route.ts`, if Stripe is unconfigured, test fallback immediately deposits funds into the user's real database vault without payment verification. |
| **SEC-006** | Arbitrary Free Checkout Settlement on Missing Stripe Keys | **Critical** | Phase 11 | In `src/server/modules/checkout/checkout.stripe.ts`, if Stripe is unconfigured, calling `createStripeSession` settles orders and creates real escrow trades for free. |
| **SEC-007** | Client-Supplied Coin Value in Item Recycle Endpoint | **Critical** | Phase 5 / 11 | `src/app/api/chests/recycle/route.ts` directly consumes `coinsValue` from client JSON without validating item provenance or ownership, allowing arbitrary coin generation. |
| **SEC-008** | Free Coin Package Purchase Endpoint | **High** | Phase 11 | `src/app/api/chests/buy-coins/route.ts` calls `chestsService.buyCoinPackage()`, which adds coins to the user without charging the user's wallet or processing a payment. |
| **SEC-009** | Unverified Crypto Deposits on Non-TRON Blockchains | **Critical** | Phase 11 | `src/server/modules/crypto/crypto-gateway.service.ts` only validates TRON transactions on-chain. EVM, Bitcoin, and Solana accept any user-supplied transaction hash and credit funds. |
| **SEC-010** | Missing Open Redirect Sanitation in OpenID Flow | **Medium** | Phase 1 | `src/lib/steam/openid.ts` `safeCallback` only checks `startsWith("/") && !startsWith("//")`, which may permit backslash (`/\\example.com`) or whitespace tricks depending on browser engine. |
| **SEC-011** | Client Model Override & IP Spoofing in AI Copilot | **Medium** | Phase 7 | `src/app/api/copilot/chat/route.ts` allows arbitrary client-specified `modelOverride` and relies on untrusted `x-forwarded-for` for rate-limiting. |
| **SEC-012** | Concurrency & Race Condition in Chest Storage | **Medium** | Phase 8 / 11 | Chest balances and unboxings are stored in flat runtime JSON files (`.chests-runtime.json`, `.user-coins-runtime.json`) rather than atomic database transactions with row-level locks. |

---

## 3. Test & Verification Baseline

### 3.1 End-to-End Suite Status
- **Command:** `npm run test:e2e` (`scripts/verify-e2e.mts`)
- **Status:** **PASSED (100%)**
- **Tested Modules:**
  1. Marketplace Search & Facet Engine (227 listings, 24 page-1 cards)
  2. Catalog Item Detail & Live Seller Book
  3. Profile Service & Public Storefronts
  4. Wallet Treasury & Committed Funds Protection
  5. Cashout Validation with Destination Address Support
  6. Basket Checkout Pricing & Discount Allocation
  7. CS2 Trade-Up Engine Pools & Autonomous Steam Daemon

### 3.2 Linter & Typecheck Status
- **Command:** `npm run lint`
- **Status:** 21 problems (5 errors, 16 warnings).
  - The 5 errors are React 19 `react-hooks/set-state-in-effect` violations within recent chest UI components (`chests-live-ticker.tsx`, `unboxing-reel.tsx`, `win-celebration-dialog.tsx`, `chest-edit-dialog.tsx`, `hub-live-drops-bar.tsx`).
  - No syntax or fatal runtime compilation errors.

---

## 4. Phase-by-Phase Roadmap

In compliance with `security.md`, the audit will proceed sequentially through the defined phases:

```
[Phase 0: Baseline & Discovery] ---> COMPLETED
       │
[Phase 1: Frontend & Browser Security] (XSS, client-side trust, browser storage, open redirects)
       │
[Phase 2: HTTP Security Headers & Browser Policies] (CSP, HSTS, frame options, permissions)
       │
[Phase 3: Authentication & Identity Security] (Better Auth, password policies, Steam OpenID, sessions)
       │
[Phase 4: Authorization, Permissions & Access Control] (IDOR, role boundaries, admin protection)
       │
[Phase 5: Server-Side Validation & Input Security] (Zod schemas, mutation integrity)
       │
[Phase 6: Injection Attacks & Data Access] (SQLi, NoSQL, template injection)
       │
[Phase 7: API Security & Request Integrity] (CSRF, rate-limiting, webhook auth)
       │
[Phase 8: Database Security & Data Integrity] (Drizzle schemas, foreign keys, transactions)
       │
[Phase 9: File Uploads, Downloads & Media] (Avatars, file signatures, S3 handling)
       │
[Phase 10: SSRF, External Integrations & Webhooks] (Steam API, TronGrid, Skinport)
       │
[Phase 11: Business Logic & Transaction Security] (Escrow, wallet balance, trade-ups, chests)
       │
[Phase 12: Advanced Attack Scenarios] (Race conditions, replay attacks, timing attacks)
       │
[Phase 13: Secrets, Dependencies & Supply-Chain] (npm audit, environment leaks)
       │
[Phase 14: Security Logging, Monitoring & Errors] (Audit logging, error sanitization)
       │
[Phase 15: Security Regression Testing & Final Report] (Full test verification & sign-off)
```

---

## 5. Phase 0 Deliverables Summary

- `security/SECURITY_SCOPE.md`: Comprehensive asset and route inventory.
- `security/ARCHITECTURE.md`: Technical stack, sequence diagrams, and threat model.
- `security/SECURITY_BASELINE.md`: Initial vulnerabilities cataloged, test baseline established.

