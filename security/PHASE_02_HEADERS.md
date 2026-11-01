# Phase 2 — HTTP Security Headers & Browser Policies Audit Report

**Application:** Relicto  
**Audit Phase:** Phase 2 — HTTP Security Headers and Browser Policies  
**Date:** November 2026  
**Status:** Completed & Verified  

---

## 1. Executive Summary

Phase 2 evaluated the HTTP response headers and browser defense policies configured in the Relicto application.

Prior to this phase, the application had no security headers configured for general application routes or API endpoints (`next.config.ts` had only targeted `/sw.js`). This left the application exposed to clickjacking, MIME-type confusion attacks, data leakage across cross-origin referrers, and unconstrained script/resource loading.

During Phase 2, a comprehensive, production-grade security header policy was engineered and deployed directly into `next.config.ts`. The policy protects against clickjacking (`frame-ancestors 'none'`, `X-Frame-Options: DENY`), restricts script execution and network destinations via a tailored `Content-Security-Policy`, enforces HTTPS transport via `Strict-Transport-Security`, blocks MIME sniffing (`X-Content-Type-Options: nosniff`), restricts browser hardware APIs (`Permissions-Policy`), and prohibits intermediary caching of API responses (`Cache-Control: no-store`).

All headers were validated using an automated test suite (`scripts/test-phase2-headers.mts`), which passed with 100% success without breaking any existing frontend features or E2E tests.

---

## 2. Header-by-Header Assessment & Configuration

| Header | Prior State | Remediated Value | Rationale & Protection Provided |
| :--- | :--- | :--- | :--- |
| **`Content-Security-Policy` (CSP)** | Missing on HTML routes | Detailed policy (see Section 3) | Prevents unauthorized script execution, malicious iframes, and restricts image/media/connect endpoints to known origins. |
| **`X-Frame-Options`** | Missing | `DENY` | Prevents the application from being framed in any external iframe (anti-clickjacking for older browsers). |
| **`X-Content-Type-Options`** | Missing | `nosniff` | Forces browsers to strictly adhere to declared MIME types, preventing script execution from image/text uploads. |
| **`Referrer-Policy`** | Missing | `strict-origin-when-cross-origin` | Protects privacy by stripping query parameters and sensitive URL fragments on cross-origin requests. |
| **`Permissions-Policy`** | Missing | `camera=(), microphone=(), geolocation=(), usb=()` | Disables browser access to unneeded device sensors and hardware APIs. |
| **`Strict-Transport-Security` (HSTS)** | Missing | `max-age=31536000; includeSubDomains` | Mandates TLS/HTTPS connections for 1 year and covers all subdomains without premature preloading risk. |
| **`X-DNS-Prefetch-Control`** | Missing | `on` | Enables DNS pre-resolution for verified outbound CDNs (Steam, TronGrid) while keeping connection security. |
| **`Cache-Control` (`/api/*`)** | Default Next.js | `no-store, max-age=0, must-revalidate` | Guarantees sensitive financial and session API responses are never cached by shared proxies or CDNs. |
| **`Cache-Control` (`/sw.js`)** | Configured | `no-cache, no-store, must-revalidate` | Preserved to guarantee service worker push updates are immediately received by client devices. |

---

## 3. Content Security Policy (CSP) Directives Breakdown

The configured CSP directive string:
```http
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://avatars.steamstatic.com https://avatars.akamai.steamstatic.com https://avatars.cloudflare.steamstatic.com https://community.akamai.steamstatic.com https://community.cloudflare.steamstatic.com https://steamcommunity-a.akamaihd.net;
font-src 'self' data:;
connect-src 'self' https://api.trongrid.io https://nile.trongrid.io https://api.steampowered.com https://api.stripe.com;
media-src 'self' data: blob:;
frame-src 'self' https://js.stripe.com;
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self' https://steamcommunity.com;
upgrade-insecure-requests;
```

### Directive Justification:
- `default-src 'self'`: Restricts all unspecified resource types to the application's own origin.
- `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com`: Allows Next.js application bundles, framework hydration scripts, dev mode HMR, and Stripe payment scripts.
- `style-src 'self' 'unsafe-inline'`: Allows Tailwind CSS stylesheet chunks and dynamic component styles.
- `img-src ...`: Permits self-hosted assets, SVG/canvas data URIs, and Valve Steam CDN domains (`steamstatic.com`, `akamaihd.net`).
- `connect-src ...`: Permits Next.js Route Handlers, Server-Sent Events ticker stream (`/api/tracker/stream`), TronGrid JSON-RPC nodes (`api.trongrid.io`, `nile.trongrid.io`), and Steam Web API.
- `frame-ancestors 'none'`: Strictly forbids framing of Relicto by any external site, neutralizing UI redress / clickjacking attacks.
- `object-src 'none'`: Disables plugins (Flash, Java, Silverlight, ActiveX).
- `base-uri 'self'`: Prevents `<base>` tag injection attacks that redirect relative URLs to an attacker-controlled server.
- `form-action 'self' https://steamcommunity.com`: Limits form submissions to same-origin and the Steam OpenID login endpoint.
- `upgrade-insecure-requests`: Automatically upgrades any legacy HTTP asset links to HTTPS.

---

## 4. Modified Files

1. [`next.config.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/next.config.ts):
   - Injected `securityHeaders` array with CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
   - Applied global headers across `/:path*` and route-specific cache prevention across `/api/:path*`.
2. [`scripts/test-phase2-headers.mts`](file:///c:/Users/akbarzadeh.ali/Relicto/scripts/test-phase2-headers.mts):
   - Created test suite validating the existence, directive correctness, and values of all configured HTTP headers.

---

## 5. Verification & Test Results

1. **Phase 2 Headers Test Suite:**
   ```bash
   npx tsx scripts/test-phase2-headers.mts
   ```
   - Global Headers check (`/:path*`): **PASSED**
     - CSP directives verified (`default-src`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `upgrade-insecure-requests`, Steam/Tron origins).
     - `X-Frame-Options: DENY`: **PASSED**
     - `X-Content-Type-Options: nosniff`: **PASSED**
     - `Referrer-Policy: strict-origin-when-cross-origin`: **PASSED**
     - `Permissions-Policy`: **PASSED**
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains`: **PASSED**
   - API Cache-Control check (`/api/:path*`): **PASSED (`no-store, max-age=0, must-revalidate`)**
   - Service Worker Cache check (`/sw.js`): **PASSED**

2. **Phase 1 Regression Suite:**
   ```bash
   npx tsx --conditions=react-server scripts/test-phase1-frontend.mts
   ```
   - **PASSED (100%)**

3. **Platform E2E Verification Suite:**
   ```bash
   npm run test:e2e
   ```
   - **PASSED (100% success across all 7 milestones)**

