# Backend progress — connecting pages to Postgres

Companion to [`backend-plan.md`](./backend-plan.md). That file is the plan; this
one tracks the page-by-page work of replacing mocks with real queries, and is
updated as each step lands.

## The pattern

Every domain follows the same four-file shape under `src/server/modules/<domain>/`:

| File | Job |
| --- | --- |
| `*.schema.ts` | zod input contracts (only where a page takes filters) |
| `*.repository.ts` | Drizzle queries — the only place SQL lives |
| `*.presenter.ts` | DB rows → the UI's existing view-model type |
| `*.service.ts` | Transport-agnostic orchestration; Server Components import this |

Rules that emerged while doing this and that the rest of the work follows:

1. **Mocks are view-models, not entities.** Read the mock *data*, not just the
   type, before designing a table. Split each mock into queryable facts
   (columns) and authored art direction (a `presentation` jsonb, or a small
   `tone` column when it is a single field).
2. **Never break the UI.** A presenter's output must satisfy the module's
   existing type verbatim. `tsc` proves the shape; a parity script proves the
   values.
3. **Never render blank.** Each `data/get-*.ts` queries Postgres and falls back
   to its mock when the table is empty.
4. **Derive, don't store, anything reproducible.** Tag chips come from rarity,
   row actions from flow + ecosystem, relative stamps from timestamps.
5. **Seed from the mock.** `npm run db:seed` is idempotent and deterministic, so
   re-running it is always safe.

### Verifying

Services `import "server-only"`, which throws under plain Node. Run throwaway
check scripts with the React Server condition so it resolves to the empty module:

```
npx tsx --conditions=react-server .verify-x.mts
```

## Status

| Route | Source | State |
| --- | --- | --- |
| `/` | `listingService.marketStats()` | ✅ live liquidity + spotlight floors |
| `/marketplace` | `listingService.catalog()` | ✅ parity-verified |
| `/items/[slug]` | `itemService.detail()` | ✅ authored mock takes precedence |
| `/orders` | `orderService.ledger()` | ✅ 6 rows, derived stats |
| `/orders/[id]` | `orderService.tracking()` | ✅ escrow, bot, token, telemetry |
| `/wallet` | `walletService.treasury()` | ✅ metrics + audit ledger |
| `/community` | `communityService.feed()` | ✅ parity-verified |
| `/wiki` | `wikiService.codex()` | ✅ parity-verified |
| `/profile` | `profileService.detail()` | ✅ parity-verified (see step 1 note) |
| `/alerts` | `alertService.list()` | ✅ parity-verified |
| `/tracker` | `trackerService.terminal()` | ✅ 3 noted divergences |
| `/sell` | `sellService.studio()` | ✅ parity-verified |
| `/checkout` | `checkoutService.basket()` + `actions/cart.ts` | ✅ reads + writes, 1 noted divergence |
| `/tournaments` | `tournamentService.arena()` | ✅ parity-verified, open-events count derived |
| notifications | `notificationService` + `/api/escrow/events` | ✅ in-app bell + Web Push |
| mobile compositions | the same services, `*-mobile.presenter.ts` | ✅ facts agree with desktop |

## Remaining steps

Each step is: read the mock data → reconcile with the schema module → build
repository/presenter/service → wire `get-*.ts` → extend the seed → verify parity
→ `tsc` + `eslint`.

### ~~Step 1 — `/profile`~~ ✅ done

Migration `0006_profile_tables`. Two new tables (`profile_status_rows`,
`profile_endorsements`), cached aggregate columns on `profiles`
(`portfolio_cents`, `inventory_count`, `review_count`, `rating_hundredths`), and
`floor_cents` / `steam_market_cents` / `seller_note` on `listings`.

Derivations that reproduce the design exactly:

- `Listing.badge` — at or below the cached floor gives `MATCHES FLOOR` /
  `UNDERCUTS FLOOR`; above it, the item's own trait tag carries the badge.
- `Listing.detail` — float plus either the live offer count or the seller's note.
- `Listing.priceTone` — white when a scraped Steam price exists, else amber.
- `ProfileStat[3].foot.right` — reputation tier derived from the rating, not pinned.

**One field is deliberately not the mock's value.** *30-Day Sales Volume* reads
`$3,150.00 / 1 peer-to-peer trade` instead of `$4,892.40 / 38 trades`, because it
is now computed from `orders` and the seed only contains one sale inside the
window. Everything else in `ProfileData` matches the mock byte for byte.

The six listings on the profile's listings tab are real catalog items owned by
the trader, so **`/marketplace` now returns more than the original 8 cards**. The eight
original cards were re-verified and are unchanged.

### ~~Step 2 — `/alerts`~~ ✅ done

Migration `0007_alert_rule_fields`. `alert_rules` gained `detail`, `icon` and
`current_cents`. The "current" column prefers the watched item's **live floor**
and falls back to the cached price, so two of the three sample rules quote real
marketplace data and the third (AWP | Dragon Lore, outside the catalog at the
time) uses its cached figure. Parity verified; only the relative stamps drift,
by the minute between seeding and reading.

### ~~Step 3 — `/tracker`~~ ✅ done

Migration `0008_tracker_tables`. Two new tables (`order_book_levels`,
`market_spreads`) and board columns on `watchlist` (`label`, `detail`,
`thumbnail_url`, `icon`, `tone`, `sort_order`). Spread and yield are derived:
spread is the secondary venue over Relicto's floor, yield is that net of
`fee_bps`.

Three deliberate divergences:

- **Spread row 3 (AK-47 | Fire Serpent)** reads `+$55.00 (+7.4%) / +$46.75`
  against the mock's `+$45.00 (+6.1%) / +$38.25`. The mock is internally
  inconsistent there — `$795.00 − $740.00` is `$55.00`, not `$45.00`. The
  derivation is right; the mock has an arithmetic error.
- **Board row 2 (Manifold Paradox)** reads `+1.8%` against the tracker mock's
  `+2.1%`, because the marketplace mock quotes `1.8%` for the same listing. The
  two mocks disagree and the catalog wins — the catalog seed now owns
  `change_percent` on upsert so no later seed can drift it.
- **The chart** is sampled from `price_points` and normalised, so it is a real
  series rather than the authored zigzag.

Adding AWP | Dragon Lore to the catalog brings `/marketplace` to **15 cards**.
The eight original cards were re-verified and are unchanged.

### ~~Step 4 — `/sell`~~ ✅ done

Migration `0009_inventory_and_views`. New `inventory_items` table — the Steam
inventory stand-in the schema never had — plus `listings.view_count` and
`profiles.inventory_counts`. Parity verified; only the relative stamps drift.

`itemId` on `inventory_items` is nullable on purpose: Steam holds plenty the
catalog doesn't carry, and the labels it returns ("Tier 2 Gem", "1,420 Kills")
don't map onto catalog fields.

**The two mocks contradict each other and both had to keep their design.** The
seller studio's three active listings and the profile storefront's six are nine
*different* items belonging to the same trader, so no single ordering shows both
designs. Resolved by giving each panel the filter it actually means:

- **Studio** — listings buyers have reached (`view_count >= 1`), newest first.
  A listing nobody has opened has nothing for the seller to decide about.
- **Profile storefront** — every active listing, unfiltered, newest first,
  capped at a six-row page.

Two formatting quirks the mocks encode and the presenters now reproduce: the
inventory rail rounds its delta to two decimals while the active panel
*truncates* to one (`+1.8%`, not `+1.9%`), and offer ceilings are quoted as
round dollars (`Max $1,580`).

`ago()` gained a day branch (`2d 11h ago`) for the studio's older listings.

### ~~Step 5 — `/checkout`~~ ✅ done

Migrations `0010_listing_checkout_fields` (`bot_name`, `intel`, `checkout` jsonb
on `listings`) and `0011_listing_photo` (`image_url` / `image_alt` on
`listings` — the seller's shot of that exact copy; the catalog art is the
fallback). The first screen that writes.

**Reads.** `(lootora)/layout.tsx` now seeds the client `CartProvider` from the
live basket instead of `checkout.mock`, so the header badge, the basket drawer
and `/checkout` all show what Postgres holds. An emptied basket renders empty;
the mock only stands in when the catalog itself is unseeded.

**Writes** — `src/modules/checkout/actions/cart.ts`, zod-parsed, each checking
the session itself:

| Action | Does |
| --- | --- |
| `addToCart({ ref })` | `ref` is a listing id (that copy) or an item slug (its cheapest copy from *another* seller). Refuses your own listing. |
| `removeFromCart({ cartId })` / `clearCart()` | Scoped to the caller's rows. |
| `placeOrder({ rail, promo, cartIds })` | Settles the basket from the vault in one transaction. |

Every action answers with the basket as the server now holds it, and
`use-cart-state.ts` reconciles its optimistic lines against that. Lines with no
listing behind them (mobile compositions still on mocks) stay client-only until
step 7.

`placeOrder` locks the wallet row and every basket listing (`FOR UPDATE`),
refuses a basket that changed since the buyer saw it (`stale`), then writes
**one escrow order per line** — the tracker and ledger both read one line per
order — with the combo/promo discount split across lines in proportion to price
(`checkout.pricing.ts`, shared with the on-screen quote so they can't disagree).
Each order gets its line snapshot, a four-step escrow timeline stopped at the
bot audit (no bots yet, so no `trade_offers` row), and a *pending* vault debit;
the listings go `reserved`. Liquid balance drops, escrow rises by the same
amount, net equity is unchanged. Only the vault rail settles — card, crypto and
Steam answer `rail-unavailable` until a payment provider exists.

Checkout-made rows use `order-chk-` / `ledger-chk-` ids, and `seedCheckout`
deletes them and re-activates their listings, so `db:seed` still resets to the
designed state after test purchases.

**Parity.** All three basket lines match `checkout.mock` exactly. Fixes on the
way:

- The seed had put the trader's **own** AK-47 listing in their basket (and
  stamped a Steam price onto it, which broke `/profile`'s storefront row). The
  basket's AK is now a separate Well-Worn copy, float 0.418, from the vault —
  which is what the checkout mock describes. `/profile` is back to parity.
- `Manifold Paradox` gets its `ARC` wear chip derived from rarity; the
  `Butterfly Knife` headline comes from the `checkout.name` override.

**One deliberate divergence:** the vault rail quotes `Avail: $3,140.00`, not
the mock's `$4,289.50`. The mock quotes `/wallet`'s *net equity*, which
includes escrowed and clearing funds nobody can spend; checkout must quote the
liquid balance. Consequently `walletAfter` reads `$508.50 USD Short` for the
seeded basket (the mock's `$1,243.90 Remaining` is also arithmetically wrong:
$4,289.50 − $3,648.50 is $641.00).

**Second copies of an item exposed three services that assumed one listing per
item**, now fixed: the marketplace keyed cards by item slug (duplicate React
keys; cards now carry `listingId`), the tracker board duplicated a row per copy
and counted reserved listings in its floor, and the item page read its move and
open offers from whichever copy sorted first. `/marketplace` now shows
**19 cards**; the original eight are unchanged.

Verified end to end in the browser against a production build: quick-buy on
`/marketplace` → live basket → Authorize & Dispatch → `/orders/LT-…` tracker.
A concurrent double-submit settles exactly once.

### ~~Step 6 — `/tournaments`~~ ✅ done

Migration `0012_tournament_fields`. Tournaments gained description, format,
capacity (+ unit), a cached `entrant_count`, `registration_closes_at`, image,
`featured` (the hero banner's events), `sort_order` and a `presentation` jsonb
(badge wording, accents, perk, calls to action, roster initials). Matches gained
`round`, `featured` (the live broadcast), `sort_order` and `presentation`.

Derived rather than stored: the hero's registration countdown (from
`registration_closes_at`, so it ticks), each roster's `+N` (entrants minus the
named initials), a match's `pending` flag (`scheduled`), its `GAME • ROUND`
label, and the broadcast's score. Page chrome, filter chips, the platform
marketing stats and the infrastructure copy stay authored — nothing real
measures them yet.

Hero, cards, broadcast and feeds match the mocks exactly. **One derived
divergence:** "Active Arenas" reads **6 open events** (every tournament not
completed) instead of the authored 24.

The loader calls `connection()` so the page renders per request; without it
Next prerendered `/tournaments` at build time and the countdown and scores froze.

### Notifications and the escrow lifecycle ✅

Migration `0013_notification_delivery`: `notifications.kind`, a unique
`dedupe_key`, and a `push_subscriptions` table.

| Event | Who | Fired by |
| --- | --- | --- |
| Someone is buying your item | seller | `placeOrder` (checkout) |
| Trade offer ready — accept in Steam | buyer | escrow webhook `offer_sent` |
| Item sold, payout credited | seller | escrow webhook `delivered` |
| Item delivered | buyer | escrow webhook `delivered` |
| Escrow cancelled / back on the market | both | escrow webhook `cancelled` |

All copy lives in `notifications.catalog.ts`. Notifications are written **inside
the transaction** that changes the order, so a rolled-back trade never
notifies; device push goes out after commit via `after()`. The dedupe key
(order code + event + recipient) means a retried event can't notify twice.

**Escrow webhook** — `POST /api/escrow/events`, `Authorization: Bearer
$ESCROW_WEBHOOK_SECRET`. This is the API the trade bots will call:

```json
{ "type": "offer_sent", "orderCode": "LT-89410-ES", "steamOfferId": "948201",
  "botName": "Relicto Sentinel Bot #42", "token": "984-KZT" }
{ "type": "delivered", "orderCode": "LT-89410-ES" }
{ "type": "cancelled", "orderCode": "LT-89410-ES", "reason": "Seller did not respond." }
```

Each event locks the order and only applies to an open escrow; a repeat answers
`unchanged`. `delivered` completes the order, marks the listing sold, settles
the buyer's pending debit and credits the seller the **listed price** (basket
discounts are Relicto's promotion). `cancelled` refunds the buyer and puts the
listing back on sale. Checkout-made ledger rows and notifications are undone
by `db:seed`.

**Delivery.** The bell loads from the database with the session, refreshes
every 30 s while the tab is visible, and at once when a push arrives (the
service worker pings open tabs). Read state is saved. Device push is opt-in
from a row in the bell ("Turn on"), using Web Push with VAPID keys and
`public/sw.js`; dead devices (404/410) are forgotten automatically.

Verified: a lifecycle script (placement → offer → retry → delivery → retry →
cancellation; 19 checks) against the real webhook, and in the browser — the
toggle subscribed through FCM, the server's push was accepted by FCM, and a
push injected through DevTools ran the service worker and refreshed the bell.
Automated Chromium can't receive pushes from FCM itself, so seeing the OS
notification pop on a real device is still to check.

**Env** (in `.env.local` for dev; add to Vercel for other environments):
`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (set a
real ops `mailto:`), `ESCROW_WEBHOOK_SECRET`. Without VAPID keys push is off
and the bell still works; without the secret the webhook answers 503.

### ~~Step 7 — mobile compositions~~ ✅ done

Every page's mobile composition now reads the same services as its desktop
one, through a `*-mobile.presenter.ts` beside the desktop presenter. Migration
`0014_spread_venue` (`market_spreads.secondary_venue`).

**The rule is different from steps 1–6.** The mobile mocks carry their own
sample numbers that contradict the desktop mocks (mobile wallet `$3,449.50`
vs desktop `$3,140.00`), so mobile can't be value-for-value with its mock and
desktop at once. Mobile is checked against **desktop**: one trader sees the
same facts at every width. Mobile-only chrome (action buttons, rail copy,
telemetry strips) stays authored.

| Mobile screen | Live now | Still authored |
| --- | --- | --- |
| `/orders/[id]` | the real order: steps, bot, token, seller, item, window — was a fake order for every code | protocol banner, link telemetry |
| `/checkout` | vault balance; **pays for real** (same `placeOrder`), then opens the new order; totals use the server's pricing | rails, handshake copy, ETH rate |
| `/wallet` | balances, 24h move, ledger with item art and signs | vault chrome, actions, rails |
| `/profile` | trust, rating, dispute rate, dispatch, tier, escrow, showcase, link badges | bot/node chrome, security checklist |
| `/marketplace` | the live catalog, one card per item at its floor, ranked by move; hearts from the watchlist; pool = hub liquidity | search copy, pills, meta-spike banner |
| `/tracker` | ticker, focus asset, candles/EMA from price history, depth, arbitrage | telemetry, relay, volume bars, other Doppler phases |
| `/alerts` | the same rules, live floors, sparklines, buying power, push status | header telemetry, Telegram/Discord relays |
| `/items/manifold-paradox` | floor, Steam ref, move, **real seller book**; buy buttons reserve a real listing | lore, styles, meta, synergy copy |
| `/tournaments` | bracket cards = the desktop tournaments; radar = live matches | championship banner, quick match |
| `/` (hub) | surge cards' price and move | esports and meta picks (editorial, as on desktop) |
| `/sell` | vault totals, instant-cashout tray (the unlisted inventory) | trade-up contract (see open issues) |

Bugs this fixed along the way:

- The mobile order tracker showed the same fake Butterfly order for every code.
- Mobile "Authorize" only toasted and navigated to a hard-coded order — nothing
  was charged. It now settles through the same action as desktop.
- The mobile item page's buy buttons used a basket id the server couldn't
  resolve, so they never reserved anything.
- The mobile wallet printed `+` before every amount — a $850 cashout read
  `+$850.00`. Signs now come from the value.
- The header wallet chip read `$0.00` for everyone; it is the real balance.
- Seed gaps: spreads weren't linked to catalog items, showcase cards and rule
  `a3` weren't linked to theirs (a final `linkShowcaseItems` /
  `linkAlertItems` pass now runs after every item exists), and the Butterfly
  sale ledger row now points at its order.

Verified: per-screen comparison scripts (mobile vs desktop, all equal), desktop
tracker output byte-identical after its query refactor, and all 11 mobile
screens at 390×844 in a production build — 200s, no console errors, no broken
images — including a real mobile payment that produced a new escrow order.

## Known data artifacts

These are consequences of the seeded sample data, not bugs. Flagged so nobody
chases them as defects:

- **Wallet 24h delta reads `+$2,800.00 (+251.5%)`** against the design's
  `+14.8%`. A $3,150 sale inside a ~$3,900 portfolio genuinely is that large a
  day. Re-timing the seeded ledger entries would settle it.
- **Net Realized P/L reads `+147.3% Net Yield`** for the same reason: seeded
  sales dwarf seeded purchases.
- **Hub liquidity reads `$6,290.90`** (the real sum of 8 active listings)
  instead of the mock's `$3,250,000`.
- **Ledger relative stamps drift a minute** between seeding and reading. That is
  live relative time working correctly.
- **The seeded basket can't be paid from the vault** (`$508.50 USD Short`),
  because the seeded liquid balance is `/wallet`'s $3,140. Remove the Butterfly
  Knife and the remaining two lines settle.

## Open issues

Fixed since step 5:

- ~~Any signed-in user could open any order's tracker by code.~~ The lookup is
  now scoped to the buyer and seller; anyone else gets a 404, same as an
  unknown code.
- ~~A stale session cookie looped `/sign-in` ↔ the app.~~ The app now sends a
  dead session to `/sign-in?expired=1`, where the proxy clears the cookie.

- ~~Mobile checkout read mocks and had no dispatch.~~ Step 7.
- ~~The header wallet chip read `$0.00`.~~ Step 7.

Still open:

- **Nothing fires the 180-second auto-cancel.** The `cancelled` transition
  exists (refund, relist, notify); it needs a cron that sends it for escrows
  past their window. Phase 4.
- **Offers don't notify yet** — there is no "make an offer" write path. When
  one lands, add an `offer_received` kind to the catalog.
- **iOS push needs an installed web app**: a manifest and 192/512px icons.
  There is no PNG brand icon in `public/` yet, so OS notifications use the
  site default.
- **Authored copy that now lies on live data:** the checkout breadcrumb's
  "Active Cart (3)", the combo banner's fixed `-$25.00`, and the dispatch
  modal's three named Sentinels.
- **Trade-ups aren't backed by the database.** The mobile trade-up contract
  (committed skins, odds, outcomes) is still authored; the `trade_ups` tables
  exist but nothing reads or writes them.
- **`db:seed -- --user <email>` is broken.** Reviews, showcase cards and alert
  rules use fixed ids, so seeding a second trader collides with the demo one.
  The handle collision is fixed; re-keying those rows per trader is not.
- **Mobile checkout has no discount rows.** Its total applies the three-item
  combo (as the server charges) but the design shows only subtotal, fee and
  total, so the discount is invisible there.
- **Radar rows use full team names** ("Gaimin Gladiators"), which wrap where the
  design had short ones. A short display name per team would fix it.

## Still missing from `backend-plan.md`

Unchanged by this work, listed so it is not lost:

- `src/lib/env.ts` zod validation
- Steam sign-in (OpenID 2.0 plugin)
- `additionalFields` / `username` plugin, 2FA, email verification and reset
- `/verify` and `/reset-password` are still static mockups
