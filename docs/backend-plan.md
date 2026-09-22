# Backend plan

From mock UI to a working app, one phase at a time. Every phase ends with
`tsc` + `eslint` clean, a manual check in the browser, a commit, and a
checkpoint before the next phase starts.

## Where we are (2026-09-22)

- **UI**: every Stitch page is built (desktop and mobile, dark and light). Data comes from mocks behind `src/modules/*/data/get-*.ts`.
- **Auth**: `better-auth` 1.7.5 with email + password, the Drizzle adapter, the `dash` plugin (`@better-auth/infra`) and `nextCookies`. The handler is mounted at `/api/auth/[...all]`, and `authClient` exists. The auth forms still only show toasts.
- **Database**: Neon project `cool-leaf-78194538` has a single branch, `production`, with the four auth tables (`user`, `session`, `account`, `verification`). They were pushed with `db:push`, so there's no migration history. Drizzle 0.45 runs on a plain `pg` Pool.
- **Missing**: `proxy.ts`, route protection, a real session (the app still reads `session.mock.ts`), and domain tables.

## Phase 0: Foundation (before auth)

1. **Dev branch.** Create a Neon `dev` branch from `production` and point `.env.local` at it. `production` only changes at release.
2. **DB module.** `src/db/client.ts` (a `pg` Pool registered with `attachDatabasePool` for Vercel) and `src/db/schema/<domain>.ts` with a barrel. `drizzle.config.ts` reads the schema folder and migrates over `DATABASE_URL_UNPOOLED`.
3. **Baseline migration.** Generate SQL for the existing auth tables and record it as applied, so migration history starts clean.
4. **Env validation.** Add `src/lib/env.ts` (zod). The app fails fast on a missing `DATABASE_URL` or `BETTER_AUTH_SECRET`.

## Phase 1: Auth (Better Auth)

1. **Steam sign-in (OpenID 2.0).** A custom Better Auth plugin:
   - `/steam/sign-in` redirects to Steam, and `/steam/callback` verifies the assertion (`check_authentication`) and reads the SteamID64.
   - It loads the profile (`GetPlayerSummaries`), creates or links the user and a `steam` account, and opens a session.
   - Steam users have no email, so they get `<steamid>@steam.invalid`.
2. **Profile fields.** Add Better Auth `additionalFields` on `user` (`steamId`, `handle`, `avatar`, `level`, `role`) and the `username` plugin, so traders can sign in by handle.
3. **Email + password.** Sign-up (handle, email, password, consent), sign-in, email verification and password reset.
4. **Two-factor.** Back the `/verify` screen with the method chosen below.
5. **Session in the app.** A server `getSession()` replaces `session.mock.ts` in the `(lootora)` layout. The client uses `authClient.useSession()`, and sign-out goes through the account menu.
6. **Route protection.**
   - `proxy.ts` does an optimistic cookie check on private routes (`/profile`, `/orders`, `/wallet`, `/sell`, `/checkout`, `/alerts`) and redirects to `/sign-in?next=…`.
   - The authoritative check is `requireSession()` in server components and actions, with `unauthorized()` for APIs.
7. **Wire the forms.** Connect the designed forms (desktop and mobile) to `authClient`, with field errors, pending states and toasts. Rate limiting uses Better Auth's built-in limiter.
8. **Verify.** Sign up, sign in, sign out, the Steam round trip (reaching steamcommunity.com needs the VPN), reset and 2FA.

## Phase 2: Domain schema (Drizzle modules)

One schema file per module, derived from the mock types in `src/modules/*/types.ts`:

| Module | Tables |
| --- | --- |
| catalog | `games`, `heroes`, `items`, `item_styles` |
| market | `listings` (float, pattern, StatTrak, status), `offers`, `watchlist` |
| cart | `cart_items` |
| orders | `orders`, `order_items`, `escrow_events`, `trade_offers` |
| wallet | `wallet_accounts`, `ledger_entries`, `payment_methods`, `payouts` |
| market data | `price_points` (time series per item and venue) |
| alerts | `alert_rules`, `alert_channels`, `alert_events` |
| notifications | `notifications` |
| profiles | `profiles` (tier, trust), `showcase_items`, `reviews` |
| esports | `tournaments`, `teams`, `matches`, `predictions` |
| trade-ups | `trade_up_contracts`, `trade_up_items` |

Conventions:
- Text ids, `created_at` / `updated_at` on every table.
- Money in integer cents.
- `pgEnum` for statuses, FKs with explicit `onDelete`, and indexes for every filter the UI uses.

Deliverables: the schema files, migrations, and a seed script built from the current mocks, so the UI looks identical on real data. Reviewed on `dev` first.

## Phase 3: APIs (data layer)

- **Reads.** Swap each `data/get-*.ts` mock for a Drizzle query that returns the same type, so the UI doesn't change.
- **Writes.** Server Actions per module (`actions/*.ts`) with zod input validation and `requireSession()`. Route Handlers only for external callers: auth, Steam callbacks, webhooks and cron.
- **Caching and revalidation.** Follow the Next 16 docs in `node_modules/next/dist/docs` when we get there.

## Phase 4: Connect

- **Interactions.** Cart, checkout, watchlist, alert rules, sell listings, trade-ups, profile edits and wallet all call the actions, with optimistic updates and revalidation.
- **External data.** Ingest the Dota datafeed (heroes, items, patches), the Steam inventory (`STEAM_API_KEY`, needs the VPN) and price feeds, scheduled with Vercel Cron.
- **Out of scope** until Steam trading and a payment provider are validated: real escrow bots and payments.

## Decisions

Recorded here as they're made.

| Date | Decision |
| --- | --- |
| 2026-09-22 | Development and migrations run on a Neon `dev` branch copied from `production`. Production changes only at release. |
| 2026-09-22 | 2FA is TOTP (Better Auth `twoFactor`: authenticator app plus backup codes). `/verify` keeps its Steam Guard look, with copy about an authenticator code. |
| 2026-09-22 | Verification and reset emails are logged to the server console for now. Pick a real provider before launch. |
