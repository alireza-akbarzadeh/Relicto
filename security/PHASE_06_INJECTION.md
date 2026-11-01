# Phase 6: Injection Attacks & Data Access Layer Report

**Target Scope:** SQL Injection, Wildcard/ILIKE Injection, Path Traversal, Unrestricted File Uploads, SSRF in external media fetching, and Data Access boundaries.  
**Execution Date:** 2026-11-01  
**Status:** **COMPLETED & VERIFIED** (16/16 Phase 6 tests passing, 0 regressions across all phases)

---

## 1. Threat Model & Vulnerabilities Addressed

| ID | Vulnerability / Threat Vector | Severity | CWE | Impact | Status |
|---|---|---|---|---|---|
| **SEC-018** | **SQL Wildcard & ILIKE Injection in Listings & Alerts** | **Medium** | CWE-89 / CWE-20 | Unescaped `%` and `_` characters in user search queries altered database query logic, matched unintended rows (e.g. `%` matching all rows in alert resolution), or enabled sequential scan DoS. | **FIXED** |
| **SEC-019** | **Path Traversal & Unrestricted File Upload in Storage Fallback** | **High** | CWE-22 / CWE-434 | `storageService.uploadFile` previously allowed arbitrary folder parameters (e.g. `../../`) and unvalidated file extensions (`.php`, `.svg`, `.html`), risking path traversal and Stored XSS under the application origin. | **FIXED** |
| **SEC-020** | **Server-Side Request Forgery (SSRF) in Steam Avatar Ingress** | **High** | CWE-918 | `storageService.syncSteamAvatar` accepted raw avatar URLs and fetched them without origin validation, allowing potential SSRF targeting cloud metadata (`169.254.169.254`) or internal network services. | **FIXED** |

---

## 2. Remediations & Technical Implementation

### 2.1 Centralized SQL Wildcard & ILIKE Sanitization
- **Shared Sanitizer Utility:**
  - Created [`src/lib/db/sql-sanitize.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/lib/db/sql-sanitize.ts) providing:
    - `escapeLike(term: string)`: Escapes `%`, `_`, and `\` characters so that user input is treated as literal characters rather than SQL wildcards.
    - `containsPattern(term: string)`: Builds safe substring search patterns: `%${escapeLike(term)}%`.
    - `startsWithPattern(term: string)`: Builds safe prefix search patterns: `${escapeLike(term)}%`.
- **Application Across Repositories:**
  - In [`src/server/modules/listings/listings.repository.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/listings/listings.repository.ts), updated `buildFilters` to sanitize `input.query` with `containsPattern(input.query.trim())`.
  - In [`src/server/modules/alerts/alerts.commands.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/alerts/alerts.commands.ts), updated `resolveItem` so that `exact` matching uses `escapeLike(clean)` and `partial` matching uses `containsPattern(clean)`, preventing wildcard `%` from matching arbitrary items.

### 2.2 Path Traversal & Unrestricted Upload Defense
- In [`src/server/modules/storage/storage.service.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/storage/storage.service.ts):
  - **Folder Whitelist:** Strictly restricted folders to `ALLOWED_FOLDERS = ["avatars", "banners", "videos", "items", "general"]`, neutralizing directory traversal inputs like `../../`.
  - **Safe Extension Enforcement:** Allowed only approved media extensions (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.mp4`, `.webm`, `.mov`). Dangerous extensions (`.php`, `.svg`, `.html`, `.exe`, `.sh`) are neutralized and rebound to safe MIME extensions or `.bin`.
  - **Directory Containment Boundary:** Added strict canonical path validation for local disk fallback:
    ```ts
    const baseUploadsDir = path.resolve(process.cwd(), "public", "uploads");
    const localFilePath = path.resolve(uploadDir, safeFilename);
    if (!localFilePath.startsWith(baseUploadsDir + path.sep)) {
      throw new Error("Security violation: Path traversal detected in storage path");
    }
    ```
- In [`src/modules/profile/actions/media.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/modules/profile/actions/media.ts):
  - Normalized and strictly validated upload kind parameters (`avatars`, `banners`, `videos`).

### 2.3 SSRF Defense in Steam Avatar Ingress
- In [`src/server/modules/storage/storage.service.ts`](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/storage/storage.service.ts):
  - In `syncSteamAvatar(steamId, steamAvatarUrl)`:
    - Mandates HTTPS protocol (`url.protocol === "https:"`).
    - Validates hostname against trusted Steam CDN hostnames:
      - `avatars.steamstatic.com`
      - `avatars.cloudflare.steamstatic.com`
      - `steamcdn-a.akamaihd.net`
      - `community.cloudflare.steamstatic.com`
      - `steamcommunity.com`
    - Rejects cloud metadata services (`169.254.169.254`), loopback addresses (`127.0.0.1`, `localhost`), and arbitrary external domains.

---

## 3. Verification & Test Suite

Automated verification suite [`scripts/test-phase6-injection.mts`](file:///c:/Users/akbarzadeh.ali/Relicto/scripts/test-phase6-injection.mts) executes 16 unit and security boundary tests:

```
--- Phase 6: Injection Attacks & Data Access Layer Tests ---

[1] SQL Wildcard & ILIKE Injection Neutralization:
  ✓ escapeLike escapes SQL wildcard % characters
  ✓ escapeLike escapes SQL wildcard _ (single char) characters
  ✓ escapeLike escapes backslash escape characters
  ✓ escapeLike neutralizes combined wildcard injection attacks
  ✓ containsPattern creates secure substring ILIKE pattern
  ✓ startsWithPattern creates secure prefix ILIKE pattern
  ✓ buildFilters in listings repository incorporates escaped query pattern

[2] Path Traversal & File System Storage Defenses:
  ✓ uploadFile strips directory traversal in filename (../../)
  ✓ uploadFile sanitizes Windows-style path separators (..\..\)
  ✓ uploadFile neutralizes dangerous executable extensions
  ✓ uploadFile neutralizes HTML/SVG stored XSS extensions
  ✓ uploadFile safely neutralizes invalid folder parameter

[3] SSRF Defenses in Steam CDN Media Ingress:
  ✓ syncSteamAvatar rejects AWS EC2 metadata service IP (169.254.169.254)
  ✓ syncSteamAvatar rejects localhost and private loopback addresses
  ✓ syncSteamAvatar rejects arbitrary untrusted origins
  ✓ syncSteamAvatar rejects plaintext HTTP even on Steam domain

=================================================
Phase 6 Injection Tests: 16 / 16 tests passed.
=================================================
```

---

## 4. Cumulative Regression Status
- Phase 1 (Frontend & Browser Security): **PASSED (100%)**
- Phase 2 (HTTP Security Headers): **PASSED (100%)**
- Phase 3 (Authentication & Identity): **PASSED (100%)**
- Phase 4 (Authorization & Access Control): **PASSED (100%)**
- Phase 5 (Validation & Input Security): **PASSED (100%)**
- Phase 6 (Injection Attacks & Data Access): **PASSED (100%)**
- Full E2E Milestone Suite (`npm run test:e2e`): **ALL 7/7 MILESTONES VERIFIED (100%)**

