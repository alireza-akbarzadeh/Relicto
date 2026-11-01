# Phase 13: Secrets, Dependencies & Supply-Chain Security — Audit & Hardening Report

**Execution Date:** November 2026  
**Status:** COMPLETE & VERIFIED (7/7 Phase Tests Passed, 100% Full Regression Passing)  
**Security Reference:** `security.md` (Phase 13 — Secrets, Dependencies, and Supply-Chain Security)

---

## 1. Executive Summary

Phase 13 audits Relicto's software supply chain, dependency tree, credentials management, and build environment to identify risks originating from third-party packages, accidentally committed secrets, and client-exposed environment variables.

In Phase 13, we conducted a systematic inventory of all environment variables in [`src/lib/env.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/env.ts), ensuring clear demarcation between server-only secrets and public client variables. We audited git history and staging rules, confirming that no live credentials or `.env` files are tracked in version control. We ran dependency vulnerability scans via `pnpm audit`, evaluated the exploitability of reported advisories, verified that Next.js SVG and `next/og` attack surfaces are entirely absent/disabled in Relicto, cleaned duplicate package entries, and verified lockfile consistency.

---

## 2. Secrets Management & Environment Boundaries

### 2.1. Client vs. Server Variable Demarcation

Next.js automatically inlines environment variables prefixed with `NEXT_PUBLIC_` into browser JavaScript bundles. Any secret inadvertently prefixed with `NEXT_PUBLIC_` is immediately leaked to all website visitors.

We audited all `NEXT_PUBLIC_` variables declared and used across the codebase:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Public Stripe publishable key (safe).
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Web Push VAPID public key (safe).
- `NEXT_PUBLIC_SITE_URL`: Canonical site origin (safe).
- `NEXT_PUBLIC_TRON_NETWORK`: Target blockchain network identifier (safe).

Zero database credentials, auth secrets, webhook signing keys, vault seeds, or private tokens are exposed to the client.

### 2.2. Environment Schema Inventory (`env.ts` & `.env.example`)

Updated [`src/lib/env.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/env.ts) and [`file:///.env.example`](file:///c:/Users/akbarzadeh.ali/Relicto/.env.example) to formally inventory all required server credentials:
- Database: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`
- Auth: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_API_KEY`
- Third-Party APIs: `STEAM_API_KEY`, `STRIPE_SECRET_KEY`, `TRONGRID_API_KEY`, `GEMINI_API_KEY`
- Webhooks & Crons: `STRIPE_WEBHOOK_SECRET`, `ESCROW_WEBHOOK_SECRET`, `CRYPTO_WEBHOOK_SECRET`, `CRON_SECRET`
- Storage & Master Vault: `CRYPTO_VAULT_SEED`, `SOTOON_ACCESS_KEY`, `SOTOON_SECRET_KEY`, `SOTOON_ENDPOINT`, `SOTOON_BUCKET`

### 2.3. Git Tracking & Ignore Enforcement

- Verified that `.gitignore` contains strict glob patterns blocking `.env*`, `*.pem`, `.vercel`, and `.*-runtime.json`.
- Executed `git ls-files` verification: confirmed that zero active secret files exist in the git index; only the sanitized `.env.example` template is tracked.

---

## 3. Dependency Vulnerabilities & Exploitability Analysis

### 3.1. Audit Findings (`pnpm audit`)

A complete scan of direct and transitive dependencies was conducted via `pnpm audit`. The advisory findings were analyzed for real-world exploitability within Relicto's architecture:

| Package & Advisory | Vulnerability Description | Relicto Exploitability Assessment | Defense / Mitigation Status |
| :--- | :--- | :--- | :--- |
| **`next`** (`GHSA-vcvr-r3jv-pc5j`) | RCE in `next/og` `ImageResponse` | **NOT EXPLOITABLE** — Relicto does not import or use `next/og` or dynamic Open Graph image generation anywhere in the codebase. | Verified by automated AST / grep search across `src/`. |
| **`next`** (`GHSA-8g9c-x5f9-2549`) | RCE in Next.js Image Optimization API when SVG files are processed | **NOT EXPLOITABLE** — Relicto has `dangerouslyAllowSVG: false` (default) in `next.config.ts`. Additionally, `storage.service.ts` converts any uploaded SVG file to a safe `.bin` representation, and `remotePatterns` restricts images strictly to Steam CDNs. | Enforced in `next.config.ts` and `storage.service.ts`. |
| **`fast-uri`** (`GHSA-333x-w4r6-6crp`) | ReDoS in transitive URI parser | **LOW** — Transitive dependency via `@google/genai -> @modelcontextprotocol/sdk`. Input URLs to Gemini Copilot are strictly validated via Zod regex before invocation. | Input schema validation in place. |
| **`deepmerge`** (`GHSA-gcqx-w48m-w2h4`) | Prototype poisoning in `deepmerge` | **LOW** — Transitive build tool dependency inside `shadcn` CLI, not invoked in runtime production request handling. | Custom prototype pollution guard active in `settings.service.ts`. |

### 3.2. Manifest & Lockfile Consistency

- Corrected duplicate entry of `"next-intl"` in `package.json`.
- Verified `pnpm-lock.yaml` is present and consistent.

---

## 4. Verification & Testing

### 4.1. Phase 13 Test Suite (`scripts/test-phase13-supply-chain.mts`)

Automated tests covering all supply-chain and secrets criteria:
1. `NEXT_PUBLIC_` audit: Confirms public environment variables contain no sensitive keywords.
2. `.gitignore` audit: Confirms exclusion of `.env*`, `*.pem`, and `.*-runtime.json`.
3. Git index audit: Confirms zero active `.env` files tracked in git besides `.env.example`.
4. `.env.example` hygiene: Confirms no production secrets or live keys exist in the template.
5. Package manifest: Confirms valid JSON syntax, no duplicate dependencies, and lockfile presence.
6. Next.js image safety: Confirms `dangerouslyAllowSVG` is disabled and `remotePatterns` is configured.
7. `next/og` absence: Confirms `ImageResponse` is not used in application code.

**Result: 7 / 7 tests passed (100%).**

### 4.2. Full Regression Suite

Executed complete test suite across Phases 1 through 13 and the end-to-end milestone suite with 100% passing results.

