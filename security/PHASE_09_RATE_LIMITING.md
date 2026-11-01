# Phase 9: API Security & Rate Limiting — Audit & Hardening Report

**Execution Date:** November 2026  
**Status:** COMPLETE & VERIFIED (8/8 Phase Tests Passed, 100% Full Regression Passing)  
**Security Reference:** `security.md` (Section 9: API Security & Rate Limiting)

---

## 1. Executive Summary

Phase 9 focuses on eliminating denial-of-service (DoS) attack vectors, credential stuffing, scraping, CPU exhaustion, and financial gateway spamming across Relicto's HTTP APIs. Prior to this phase, several endpoints lacked explicit request quotas and burst controls, leaving endpoints susceptible to rapid automated execution.

In Phase 9, we developed a production-ready, sliding-window rate limiting engine (`src/server/modules/security/rate-limiter.ts`) supporting burst cooldowns, automatic stale-record eviction, tiered quota limits, client IP resolution (handling proxy forwarding chains), and standard HTTP headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`). We integrated these limiters across all critical API surfaces and enabled native rate limiting within Better Auth.

Additionally, an authorization check flaw in `POST /api/chests` was identified and remediated by enforcing authoritative `requireAdminRole()` and CSRF protection.

---

## 2. Threat Modeling & Attack Surface Audit

| Threat ID | Endpoint / Surface | Vulnerability / Attack Vector | Impact / Severity |
| :--- | :--- | :--- | :--- |
| **THREAT-9.1** | `/api/auth/*` | Credential stuffing, brute-force password attacks, automated email harvesting | **HIGH** — Account takeover and identity brute-forcing. |
| **THREAT-9.2** | `/api/search` | Aggressive automated scraping and search engine DoS via unthrottled catalog queries | **MEDIUM** — Database connection saturation and compute resource drain. |
| **THREAT-9.3** | `/api/chests/[slug]/simulate` | CPU exhaustion through high-volume Monte Carlo simulations (up to 1,000 rolls/request) | **HIGH** — CPU starvation impacting application event loop responsiveness. |
| **THREAT-9.4** | `/api/chests/[slug]/open` | Rapid chest unboxing spam attempting race conditions or state desynchronization | **HIGH** — Transactional lock contention and potential wallet desync. |
| **THREAT-9.5** | `/api/wallet/stripe/create-session`, `/api/checkout/stripe/create-session` | Stripe session generation flooding and third-party rate limit exhaustion | **HIGH** — Upstream Stripe API rate limit penalty or webhook overload. |
| **THREAT-9.6** | `/api/crypto/verify`, `/api/crypto/tron/verify` | Flooding TronGrid/blockchain RPC nodes with bogus verification requests | **HIGH** — RPC quota depletion, node rate limiting, and server thread blocking. |
| **THREAT-9.7** | `/api/chests` (POST) | Missing admin authorization guard allowing unprivileged authenticated users to create chests | **CRITICAL** — Unauthorized catalog tampering. |

---

## 3. Architecture & Implementation

### 3.1. Sliding-Window Rate Limiter Engine (`rate-limiter.ts`)

Created [`src/server/modules/security/rate-limiter.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/security/rate-limiter.ts):
- **Algorithm:** True sliding window using epoch millisecond timestamps per client key.
- **Burst Defense:** Configurable `minIntervalMs` (enforces strict inter-request delays to eliminate high-frequency microbursts).
- **Memory Safety:** Automatic lazy garbage collection (`cleanup`) evicts idle client records exceeding `2 * windowMs`.
- **IP Resolution:** `getClientIp` safely traverses `X-Forwarded-For` (first trusted hop), `X-Real-IP`, and `CF-Connecting-IP`, falling back to `127.0.0.1`.
- **Standard HTTP Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed in the window.
  - `X-RateLimit-Remaining`: Remaining request quota.
  - `X-RateLimit-Reset`: Seconds remaining until window reset.
  - `Retry-After`: Required seconds before next allowable request when status `429 Too Many Requests` is returned.

### 3.2. Tiered Rate Limiting Configuration

| Tier Name | RateLimiter Instance | Window | Quota | Min Interval | Target Endpoints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | Better Auth Built-in | 60s | 30 req | N/A | `/api/auth/*` |
| **Public Search** | `searchRateLimiter` | 60s | 60 req | 100ms | `/api/search` |
| **Simulation** | `simulationRateLimiter` | 60s | 10 req | 1,000ms | `/api/chests/[slug]/simulate` |
| **Chest Unboxing** | `chestOpenRateLimiter` | 60s | 30 req | 500ms | `/api/chests/[slug]/open` |
| **Economy Ops** | `economyRateLimiter` | 60s | 30 req | 500ms | `/api/chests/buy-coins`, `/recycle`, `/daily-bonus` |
| **Financial Gateways** | `financialRateLimiter` | 60s | 20 req | 1,000ms | `/wallet/stripe/create-session`, `/checkout/stripe/create-session`, `/crypto/verify`, `/crypto/tron/verify`, `/crypto/address` |
| **AI Copilot** | `copilot-rate-limit.ts` | 60s / 1hr | 6/min, 30/hr | 3,000ms | `/api/copilot/chat` (+ 15-min TTL semantic cache) |

### 3.3. API Authorization Hardening

- **`src/app/api/chests/route.ts`:**
  - Fixed an authorization vulnerability on `POST /api/chests` where any authenticated user could invoke `adminCreateChest`.
  - Added strict `verifyCsrf(req)` verification.
  - Added strict `requireAdminRole()` authoritative role verification (yielding 403 Forbidden for non-admins).

---

## 4. Verification & Testing

### 4.1. Phase 9 Test Suite (`scripts/test-phase9-rate-limiting.mts`)

Automated test suite verifying the complete rate limiting system:
1. **Sliding Window Enforcement:** Confirms quota decrement, breach rejection on `maxRequests`, and emission of correct `retryAfterSeconds`.
2. **Burst Cooldown Protection:** Confirms rapid back-to-back requests within `minIntervalMs` are blocked with 429 and informative reason.
3. **Client Isolation:** Confirms separate client keys (`trader-alpha` vs `trader-beta`) do not interfere with each other's quota.
4. **IP Resolution:** Confirms correct parsing of forwarded proxy headers and fallbacks.
5. **applyRateLimit Helper:** Confirms standard headers (`X-RateLimit-*`) on success and structured 429 response on breach.
6. **Better Auth Config:** Confirms `auth.options.rateLimit` is active with memory storage.
7. **Tier Configurations:** Confirms window, quota, and cooldown properties across all 5 exportable tiers.
8. **Endpoint Integration:** Confirms `GET /api/search` emits live `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers.

**Result: 8/8 tests passed (100%).**

### 4.2. Full Security Regression

All security phases were executed sequentially with zero regressions:
- Phase 1 (Frontend): 100% passed
- Phase 2 (Headers): 100% passed
- Phase 3 (Auth): 100% passed
- Phase 4 (Authorization): 100% passed
- Phase 5 (Validation): 100% passed (24/24)
- Phase 6 (Injection): 100% passed (16/16)
- Phase 7 (Session & CSRF): 100% passed (12/12)
- Phase 8 (Crypto & Secrets): 100% passed (8/8)
- Phase 9 (Rate Limiting): 100% passed (8/8)
- E2E Verification (`verify-e2e.mts`): 7/7 milestones passed

