# Security Scope & Inventory

**Application:** Relicto (Counter-Strike 2 & Steam Item Marketplace & Escrow Platform)  
**Date:** November 2026  
**Auditor Role:** Senior Application Security Architect  
**Scope Classification:** Authorized Application Security Baseline (Phase 0)

---

## 1. Project Overview & Authorized Scope

Relicto is a full-stack, peer-to-peer virtual item trading, escrow, and case-opening platform built on Next.js 16 (App Router), React 19, Drizzle ORM, Neon Serverless PostgreSQL, and Better Auth.

### 1.1 In-Scope Assets & Components
- **Repository Root:** `c:\Users\akbarzadeh.ali\Relicto`
- **Application Codebase:**
  - `src/app`: Page routing, layouts, server-side data loading, and Next.js Route Handlers.
  - `src/server`: Server-side domain business logic, repositories, and services.
  - `src/modules`: Domain feature modules (UI presentation, client state, data hooks).
  - `src/lib`: Core infrastructure (Database client, Better Auth config, Stripe, Steam OpenID, Tron/Crypto utils).
  - `scripts`: Autonomous daemon scripts (`steam-bot-daemon.ts`) and test suites (`verify-e2e.mts`).
  - `drizzle`: Database migration schemas and relational definitions.
- **Environments:**
  - **Local Development:** `http://localhost:3000` (Node.js 22 runtime, PostgreSQL via Neon pooled connection string).
  - **Vercel Staging / Production:** Production edge and serverless environments.

### 1.2 Out-of-Scope Assets
- Valve Steam infrastructure (Steam Community, Steam Web API servers).
- Stripe payment gateway core servers and financial network.
- Neon Cloud hosting infrastructure and AWS hardware.
- External blockchain nodes (TRON Grid, EVM RPC nodes, Bitcoin/Solana mainnets).
- Third-party data providers (Skinport price API).

---

## 2. Inventory of Entry Points & Route Handlers

### 2.1 Public Frontend Routes
These routes are unauthenticated and accessible to any visitor or web crawler:
| Route | Purpose | Sensitive Operations / Data Handled |
| :--- | :--- | :--- |
| `/(lootora)/page.tsx` | Platform landing page | Public market highlights, featured items |
| `/(lootora)/marketplace` | Item catalog and search | Filtering, sorting, search queries, pagination |
| `/(lootora)/items/[slug]` | Individual item view | Live seller book, order book, price chart |
| `/(lootora)/chests` | Chest hub & catalog | Case definition display, odds display, daily bonus |
| `/(lootora)/chests/[slug]` | Chest unboxer arena | Interactive unboxing reel, provably fair simulator |
| `/(lootora)/tournaments` | Esports tournaments | Match schedules, team rankings |
| `/(lootora)/community` | Trade-up contracts & forum | Trade-up forge simulation, discussion topics |
| `/(lootora)/traders/[handle]` | Public trader storefront | User profile stats, listed inventory items |
| `/(lootora)/wiki` | Platform guides | Item skins, float wear documentation |
| `/(auth)/sign-in` | Authentication page | Credentials login, Steam OpenID button |
| `/(auth)/sign-up` | Account registration | Account creation form |
| `/(auth)/reset-password` | Password recovery | Reset token submission |
| `/(auth)/verify` | Email verification | Verification token handling |

### 2.2 Authenticated Account Routes (`/(lootora)/(account)/*`)
Guarded by layout-level `requireSession()` in `src/app/(lootora)/(account)/layout.tsx`:
| Route | Purpose | Security Controls & Sensitivity |
| :--- | :--- | :--- |
| `/dashboard` | Trader management dashboard | Session required; financial overview, active orders |
| `/wallet` | Vault & balance management | Session required; deposit rails, cashout actions, balance display |
| `/checkout` | Cart checkout & discount engine | Session required; order row placement, Stripe session launch |
| `/orders` & `/orders/[id]` | Order history & live escrow | Session required; escrow status, Steam trade offer links |
| `/sell` | Sell studio & inventory sync | Session required; Steam inventory listing, price setting |
| `/alerts` | Price & float alert rules | Session required; push notification rules |
| `/tracker` | Live arbitrage & book ticker | Session required; order books, real-time ticker stream |
| `/profile` & `/user` | User settings & Steam link | Session required; Steam trade URL, API keys, 2FA settings |
| `/kyc` & `/user/kyc` | Identity verification | Session required; KYC tier inspection and document upload |

### 2.3 Administrative Routes
| Route | Path | Current Status |
| :--- | :--- | :--- |
| Admin Gateway | `/admin` | Currently redirects to `/dashboard` via `src/app/admin/page.tsx`. No dedicated admin privilege checks currently enforced. |

### 2.4 API Route Handlers (`src/app/api/*`)
| Route Path | Methods | Authentication / Authorization Mechanism | Sensitive Operations |
| :--- | :--- | :--- | :--- |
| `/api/auth/[...all]` | ALL | Better Auth built-in handlers + Steam OpenID plugin | Sign-in, sign-up, session creation, 2FA, password reset |
| `/api/checkout/stripe/create-session` | POST | `requireUserId()` | Creates Stripe payment session or falls back to free settle |
| `/api/checkout/stripe/webhook` | POST | Stripe HMAC signature (`stripe-signature`) | Settle orders, dispatch escrow |
| `/api/webhooks/stripe` | POST | Stripe HMAC signature (`stripe-signature`) | Settle wallet deposits and checkout orders (duplicate) |
| `/api/wallet/stripe/create-session` | POST | `requireUserId()` | Creates Stripe wallet deposit session or falls back to free balance credit |
| `/api/crypto/address` | GET | `requireUserId()` | Derives deterministic deposit address for user |
| `/api/crypto/verify` | POST | `requireUserId()` | Accepts user txHash to credit balance (EVM/Solana/BTC unchecked) |
| `/api/crypto/tron/verify` | POST | `requireUserId()` | Checks TRON on-chain transaction status |
| `/api/webhooks/crypto` | POST | Bearer token (`CRYPTO_WEBHOOK_SECRET`) | Automatically credits user balances (Bypassed if secret unset) |
| `/api/chests` | GET | Optional `getUserId()` | Returns chest catalog and user coin balance |
| `/api/chests/buy-coins` | POST | `getUserId()` | Purchases coin packages (Currently grants coins without charge) |
| `/api/chests/daily-bonus` | POST | `getUserId()` | Claims 100 RC daily bonus |
| `/api/chests/recycle` | POST | `getUserId()` | Credits user coins for recycled item (Accepts arbitrary client coin value) |
| `/api/chests/[slug]` | GET | Optional `getUserId()` | Returns chest definition and streak-escalated odds |
| `/api/chests/[slug]/open` | POST | `getUserId()` | Deducts coins/wallet and rolls unboxing algorithm |
| `/api/chests/[slug]/simulate` | POST | Public | Runs Monte Carlo simulations |
| `/api/copilot/chat` | POST | IP rate-limiting | Gemini AI market copilot (Allows client `modelOverride`) |
| `/api/cron/escrow-timeouts` | GET | Bearer token (`CRON_SECRET`) | Auto-refunds expired escrow orders and cancels lapsed bids |
| `/api/cron/price-feed` | GET | Bearer token (`CRON_SECRET`) | Updates Skinport/market item prices |
| `/api/cron/dota-feed` | GET | Bearer token (`CRON_SECRET`) | Syncs Dota 2 market catalog prices |
| `/api/cron/steam-daemon` | GET | Bearer token (`CRON_SECRET`) | Triggers automated Steam bot trade offer dispatch |
| `/api/escrow/events` | GET | `requireUserId()` | Escrow real-time updates |
| `/api/notifications` | GET, POST | `getUserId()` | Fetches or marks notifications read |
| `/api/offers/mine` | GET | `requireUserId()` | Lists active buy and sell offers for user |
| `/api/search` | GET | Public | Full-text and faceted catalog search |
| `/api/tracker/market` | GET | Public | Tracker venue pricing snapshot |
| `/api/tracker/stream` | GET | Public | SSE live ticker stream |

---

## 3. Database Schema & Data Assets

Managed by Drizzle ORM connected to Neon Serverless PostgreSQL (`src/lib/db/schema/*`):
- **Identity & Auth:** `user`, `session`, `account`, `verification`, `two_factor`
- **Profiles & Stats:** `profiles`, `trader_stats`, `guilds`
- **Catalog & Inventory:** `catalog_items`, `collections`, `inventories`, `inventory_items`
- **Market & Trade:** `listings`, `offers`, `order_rows`, `escrow_orders`
- **Financial Treasury:** `wallets`, `ledger_entries`, `cashouts`, `deposits`
- **Analytics & Feeds:** `market_ticks`, `price_series`, `order_books`
- **Alerts & Messaging:** `alert_rules`, `alert_history`, `notifications`, `push_subscriptions`
- **Esports & Gaming:** `tournaments`, `tournament_teams`, `tournament_matches`, `trade_ups`, `trade_up_inputs`, `trade_up_outputs`
- **Community & Content:** `discussions`, `discussion_comments`, `community_posts`, `wiki_articles`, `wiki_categories`
- **Audit:** `audit_logs`

---

## 4. External Integrations & Service Providers

1. **Neon PostgreSQL:** Serverless PostgreSQL with pooling (`@vercel/functions` attach pool).
2. **Better Auth:** Authentication framework managing sessions and passwords.
3. **Valve Steam OpenID 2.0 & Steam Web API:**
   - OpenID assertion verification via `steamcommunity.com/openid/login`.
   - Steam persona lookup via `api.steampowered.com`.
   - Automated trade offers via background daemon.
4. **Stripe API:** Card payment processing and webhook signature verification (`stripe-signature`).
5. **TRON Grid / TRC20 Gateway:** On-chain verification of USDT transfers.
6. **Google Gemini GenAI SDK:** AI Copilot intelligence using `@google/genai`.
7. **Web-Push (VAPID):** Browser push notifications.
8. **Skinport API:** Third-party pricing feed.

---

## 5. Summary of Key Security Boundaries

- **Browser Boundary:** React 19 Client components handling user interactions and forms.
- **Application Boundary:** Next.js Server Components and Route Handlers handling sessions and requests.
- **Database Boundary:** Drizzle ORM executing parameterized SQL against Neon PostgreSQL.
- **Integration Boundary:** Webhooks validating external HMAC signatures or bearer tokens.
- **Execution Boundary:** Cron jobs and daemon cycles validated via timing-safe bearer secrets.

