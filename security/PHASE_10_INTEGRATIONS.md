# Phase 10: SSRF, External Integrations & Webhooks — Audit & Hardening Report

**Execution Date:** November 2026  
**Status:** COMPLETE & VERIFIED (9/9 Phase Tests Passed, 100% Full Regression Passing)  
**Security Reference:** `security.md` (Phase 10 — SSRF, External Integrations, and Webhooks)

---

## 1. Executive Summary

Phase 10 audits and hardens server-side communication with external services, third-party APIs, and inbound webhook endpoints. External integrations introduce critical security boundaries: outbound calls can be vulnerable to Server-Side Request Forgery (SSRF), URL path manipulation, and slowloris/DoS timeouts, while inbound webhooks face forgery, replay attacks, duplicate settlement, and parameter tampering.

In Phase 10, we audited all outbound HTTP paths and inbound webhooks across Relicto. We eliminated SSRF and path-injection risks in Steam and Skinport API clients by enforcing strict SteamID64 format validation (`/^\d{17}$/`) and integer appId checks. We hardened the crypto webhook endpoint (`/api/webhooks/crypto`) by implementing strict Zod schema validation that neutralizes JavaScript `NaN` type-bypass, negative values, and oversized payloads. Furthermore, we audited and verified webhook signature validation, timestamp replay tolerances, and transactional idempotency.

---

## 2. Outbound Request Inventory & Threat Analysis

Relicto maintains server-side outbound connections to the following external APIs and third-party services:

| Integration | Destination Host / Endpoint | Purpose | Threat Vectors | Defenses Implemented |
| :--- | :--- | :--- | :--- | :--- |
| **Steam Inventory** | `https://steamcommunity.com/inventory/${steamId}/${appId}/2` | Fetching user game items | SSRF, path traversal via malformed `steamId` | Strict `/^\d{17}$/` regex, integer `appId > 0` validation, 15s timeout. |
| **Steam Persona** | `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/` | Resolving user display name & avatar | Query parameter injection, API key exposure | Strict `/^\d{17}$/` regex, 8s timeout, fail-safe fallback persona. |
| **Steam OpenID** | `https://steamcommunity.com/openid/login` | Cryptographic assertion check (`check_authentication`) | Assertion spoofing, open redirect | Domain verification, strict realm/return_to match, 10s timeout. |
| **Steam Avatar CDN** | `avatars.steamstatic.com`, etc. | Mirroring Steam avatar to object storage | SSRF reaching cloud metadata (169.254.169.254) or localhost | Protocol enforced to HTTPS, strict hostname whitelist (`ALLOWED_STEAM_HOSTS`), 10s timeout. |
| **Skinport Quotes** | `https://api.skinport.com/v1/items?app_id=${appId}` | Public market price reference feed | Query string injection, DoS | Validated `Number.isInteger(appId) && appId > 0`, 30s timeout, cached. |
| **OpenDota API** | `https://api.opendota.com/api/heroes` | Dota 2 hero catalog updates | Service outage, malformed JSON | Static endpoint, 6s timeout, fail-safe canonical local fallback dataset. |
| **TRON FullNode** | `${config.fullNode}/wallet/gettransactioninfobyid` | On-chain verification of TRC-20 USDT deposits | Bogus RPC queries, node starvation | Hex-validated txid (`isValidTronTxId`), prior ledger idempotency check, 6s timeout. |
| **Google Gemini AI** | Google GenAI SDK | AI Sentinel trade copilot | Prompt injection, quota DoS, latency hangs | Model whitelist, sliding-window rate limit, 15-min TTL cache, 8.5s timeout. |
| **Sotoon Object Storage** | Sotoon S3-compatible API | Persistent media asset storage | Path traversal, MIME type spoofing | Sanitized filenames, extension-to-MIME whitelist, path containment. |

---

## 3. Inbound Webhook Security Assessment

### 3.1. Stripe Webhooks (`/api/webhooks/stripe` & `/api/checkout/stripe/webhook`)

- **Signature Verification:** Validated via official `stripe.webhooks.constructEvent(payload, signature, secret)` using HMAC-SHA256.
- **Fail-Closed Behavior:** If `STRIPE_WEBHOOK_SECRET` is unset, the endpoint immediately responds with `503 Service Unavailable`, rejecting unauthenticated execution.
- **Replay Protection:** Stripe SDK enforces an automatic 300-second (5-minute) timestamp tolerance window, rejecting replayed messages.
- **Idempotency & Deduplication:**
  - **Wallet Deposits:** `deposit()` checks for existing ledger records matching `txHash` under a row-level lock (`for("update")`). If already settled, it returns `{ status: "credited" }` without re-crediting the balance.
  - **Checkout Orders:** `settle()` checks active cart lines under transaction lock. Once settled, lines are atomically cleared, ensuring duplicate deliveries return `{ status: "empty" }` with zero duplicate order creation.

### 3.2. Web3 Crypto Webhook (`/api/webhooks/crypto`)

- **Authentication:** Validated via `bearerMatches(authHeader, secret)` using constant-time SHA-256 pre-hashed matching to prevent timing attacks and secret length leakage.
- **Fail-Closed Behavior:** Responds with `503 Service Unavailable` if `CRYPTO_WEBHOOK_SECRET` is unconfigured.
- **Input Validation Hardening:**
  - *Previous Vulnerability:* Manual `typeof amountUsd !== "number"` check could be bypassed by `NaN`, `Infinity`, or negative values.
  - *Remediation:* Integrated `cryptoWebhookInputSchema` (Zod):
    - `userId`: trimmed string (1–64 chars).
    - `networkId`: strictly validated enum of approved networks (`usdt-trc20`, `usdc-base`, etc.).
    - `txHash`: regex-validated transaction identifier (24–128 chars).
    - `amountUsd`: finite positive number ($1 to $100,000 USD).
- **Idempotency:** `verifyAndSettleCryptoDeposit` inspects existing settled ledger entries and safely returns `already_claimed`.

---

## 4. Verification & Testing

### 4.1. Phase 10 Test Suite (`scripts/test-phase10-integrations.mts`)

Automated tests covering all audit criteria:
1. `fetchSteamInventory`: Confirms rejection of directory traversal (`../admin`) and non-17-digit SteamIDs.
2. `fetchSteamInventory`: Confirms rejection of invalid/negative `appId`.
3. `fetchSteamPersona`: Confirms rejection of malformed SteamIDs without outbound network dispatch.
4. `fetchSkinportQuotes`: Confirms rejection of invalid `appId`.
5. `storageService.syncSteamAvatar`: Confirms rejection of plaintext HTTP, cloud metadata IPs (`169.254.169.254`), loopback addresses (`127.0.0.1`), and untrusted origins.
6. Stripe Webhooks: Confirms 400 rejection when `stripe-signature` header is absent.
7. Crypto Webhook: Confirms 401 rejection for missing or invalid bearer tokens.
8. Webhook Zod Schema: Confirms strict rejection of `NaN`, negative numbers, infinite amounts, and unsupported networks.
9. Crypto Webhook Endpoint: Confirms 400 rejection for malformed payload.

**Result: 9 / 9 tests passed (100%).**

### 4.2. Full Regression Suite

Executed complete test suite across Phases 1 through 10 and the end-to-end milestone suite with 100% passing results.

