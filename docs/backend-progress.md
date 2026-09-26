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
| `/marketplace` | `listingService.search()` | ✅ filters, totals and facets in Postgres (phase 5) |
| `/items/[slug]` | `itemService.detail()` | ✅ authored mock takes precedence; all 162 resolve |
| `/orders` | `orderService.ledger()` | ✅ 6 rows, derived stats |
| `/orders/[id]` | `orderService.tracking()` | ✅ escrow, bot, token, telemetry |
| `/wallet` | `walletService.treasury()` | ✅ metrics + audit ledger |
| `/community` | `communityService.feed()` | ✅ parity-verified |
| `/wiki` | `wikiService.codex()` | ✅ parity-verified |
| `/profile` | `profileService.detail()` + `watchlistService.watched()` | ✅ parity-verified; watchlist tab (phase 6) |
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
| `/sell` | vault totals, instant-cashout tray (the unlisted inventory); trade-up chamber since Phase 4 | bot name, rails |

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

## Phase 4 — interactions and external data

| Item | State |
| --- | --- |
| Cart + checkout writes | ✅ step 5 |
| Watchlist (`relicto/actions/watchlist.ts`) | ✅ hearts + tracker board |
| Alert rules (`alerts/actions/rules.ts`) | ✅ create + arm/disarm, migration `0015` |
| Sell listings (`sell/actions/listings.ts`) | ✅ list + delist |
| Wallet (`wallet/actions/treasury.ts`) | ✅ cashout request + vault freeze, migration `0016` |
| Escrow buyer actions (`orders/actions/escrow.ts`) | ✅ cancel + dispute |
| Escrow auto-cancel | ✅ expired on read + `/api/cron/escrow-timeouts` (daily on Vercel) |
| **Trade-ups** | ✅ see below |
| Steam sign-in | 🟡 redirect + forged-assertion rejection verified (phase 8); a real Steam login click-through still needs a human, and `STEAM_API_KEY` is empty |
| Profile edits | ☐ no design yet — the hero button still toasts "on the roadmap" |
| Make an offer | ✅ Phase 7 — bid, revise, withdraw, accept → escrow, decline |
| Steam inventory sync | ✅ phase 8 — `/sell` mirrors CS2, Dota 2 and TF2 inventories |
| Price feed + cron | ✅ phase 8 — daily Skinport snapshot, Relicto sales recorded |
| Wallet deposits | ✅ phase 8 — simulated outside production (`CHECKOUT_MOCK_PAYMENTS`) |
| Dota datafeed | ☐ not started |

### Trade-ups ✅

Migration `0017_trade_up_forge`. New `trade_up_outcomes` (the CS2 pool: item,
value, chance, `tone`), `trade_up_contracts.seed` / `outcome_id`,
`trade_up_items.inventory_item_id`, a unique slot per contract and **one open
draft per trader** (partial unique index). Server module
`src/server/modules/trade-ups/`; actions `sell/actions/trade-ups.ts`.

- **The chamber is a persisted draft.** Inputs are the trader's own unlisted
  inventory copies. Every slot tap and Smart Fill saves the whole slot list
  (`saveContractSlots`); the server answers with the chamber as it holds it and
  the client adopts only the newest answer. Reading never opens a draft.
- **Rules are enforced server-side:** own + unlisted copies, CS2 grades only
  (no ★ knives/gloves, no Souvenir/Contraband), one grade per contract, ten
  inputs to ignite. The client applies the same rules from `sell/lib/trade-up.ts`.
- **Ignite draws on the server** (`crypto.getRandomValues`), after locking the
  draft and all ten inputs, and refuses a chamber that differs from what the
  client showed (`stale`). In one transaction: the inputs are burned, the
  outcome joins the inventory (wear from the inputs' average float), the
  contract records outcome, value and odds, the profile's cached units and
  portfolio move, and a fresh draft opens with a new seed.
- Committed skins leave the desktop studio rail and the mobile cashout tray.
- Derived rather than authored: EV (Σ chance × value), float average + wear
  band (live as slots change), tier wording and verdict (from `tone`), seed label.

**Divergences.** EV reads **$449.69** (ROI +16.95%) against the mock's $462.10
(+20.18%): the mock's EV doesn't match its own odds. Slot tiles show the finish
("Redline", "Kill Confirmed") where the design abbreviated by hand ("AK-47",
"Kill Conf"). The three Smart Fill skins are real inventory, so the desktop
studio rail shows **9** items instead of 6.

**Not real yet.** The outcome pool is stored per game, since there is no
collection data to derive it from, and values are cached quotes, not live
floors. Settlement is database-only. No bot executes a contract in Steam, and a
Steam inventory sync would overwrite forge-made rows. `db:seed` rebuilds the
trader's contracts and undoes forge-made inventory.

Verified: a service script (21 checks: reads, knife/mixed/foreign refusals,
save, stale ignite, settle, burn, units −9, new draft, replay refused), a 200k
draw distribution (18.5 / 34.5 / 47.0%), and in the browser at 390×844 against
the dev server — Smart Fill → Ignite → result dialog → outcome in the cashout
tray, no console errors.

## Phase 5 — the buying flow on a real catalog

The database the app pointed at held only the four Better Auth tables — no
domain tables, no migrations — so every page was rendering its mock fallback.
`0000_baseline_auth` was recorded as applied (the tables already existed) and
migrations `0001`–`0017` then ran clean.

### Catalog depth

`seed-catalog.ts` adds **144 generated items** behind the 18 designed ones, so
the marketplace counts something real: **163 active listings**, 3 ecosystems,
20 heroes, every wear tier and all four price bands populated — 7 pages at 24
per page. Definitions live in `seed/catalog/{dota,cs2,tf2}-items.ts` as tuples;
art direction, 24h move, offer count and age are derived from a hash of the
slug, so a re-seed is byte-identical. Ids are prefixed `item-cat-` /
`listing-cat-`, keeping depth separable from the designed catalog.

Writes are bulk (`excluded.*` upserts, chunked): row-by-row over a remote Neon
branch took minutes, and a seed nobody re-runs stops being run.

**Artwork repeats.** There are eight item shots in `public/`; generated rows
pick one by game and slot. Real per-item art is a content job.

### Filters now run in Postgres

`/marketplace` was handing the browser a 96-row page and filtering it in
memory, over invented totals (`CATALOG_META` claimed 1,248 items / 64 pages).
The repository's `buildFilters` had been written for this and never wired up.

The page now reads the same nuqs contract the sidebar writes, and
`listingService.search()` answers with one page, the real total and live facet
tallies. `shallow: false` makes a criterion change re-run the server component.
Added on the way: `safeguards` (jsonb containment), the `change` and `volume`
sorts, a `minFloat` bound, hero-name search, an id tiebreaker so paging can't
repeat a row, and `countFacets()` behind the sidebar's counts.

**The designed default state was a fiction.** The Stitch sidebar shows Dota 2 +
Arcana/Immortal + two safeguards ticked over a grid of unfiltered cards —
no honest query produces that, and applied for real it returned 2 listings. The
old code faked it by ignoring filters until one was touched. `/marketplace` now
lands unfiltered with an empty sidebar; ticking those boxes reproduces the
designed sidebar exactly, and the grid then shows what it actually selects.

### Payment is mocked

`checkout.payment.ts` stands in for the provider that hasn't been chosen. The
vault rail settles as before; card, crypto and Steam are authorized instantly
and fund the vault for exactly what's due, so the rest of checkout — locking,
escrow orders, ledger, notifications — is the same code path a real provider
will run. Nothing is charged, and the ledger says so. Swapping `authorize()`
for a real call is the whole integration.

Mock authorizations are **off in production** unless `CHECKOUT_MOCK_PAYMENTS=true`
is set deliberately; on everywhere else unless set to `false`.

### The price chart is a real chart

`PriceChart` drew a hand-placed SVG polyline against a fixed `viewBox`. The
Postgres presenter fed it `{ x: index, y: dollars }` while the mock fed it SVG
coordinates — so **every database-backed item's chart was drawn wrong**.

`PricePoint` is now `{ at, price }` — real epoch ms and real dollars — and
`price-plot.tsx` draws it with Recharts through the shadcn `ChartContainer`
that was installed but unused. Both axes scale from the data, the tooltip
works, annotations are `ReferenceLine`s on the time axis instead of hardcoded
CSS percentages, and the range pills (24H…ALL) actually select a slice —
they were inert. `CANDLE` renders daily closes as bars; there is no OHLC behind
it, because the catalog stores one close per day.

The authored mock's decorative coordinates became real prices that agree with
its own stats — the $108.20 low on Oct 29 and the $139.00 peak on Nov 18.

### Fixed

- **Every generated item's page 500'd.** `StyleProgression` read `styles[0].id`,
  and only authored items have style rows. All 162 item pages now return 200.
- **Seven listings matched no safeguard filter.** `seed-seller-catalog.ts` and
  `seed-tracker.ts` wrote `safeguards: ["escrow"]`, which is not a
  `SafeguardKey`. Long-standing — the old client-side filter excluded them too —
  but now that the filter is real it was silently hiding rows.

### Verified

- `.verify-flow.mts` — 21 checks: filtered list → item detail → basket (by
  listing id and by item slug) → checkout on the mocked card rail → escrow
  orders → listing reserved.
- `.verify-chart.mts` — 32 checks across both producers: real timestamps,
  ordered series, dollar-scale prices, every range pill drawable.
- Through HTTP against the dev server: `game=cs2&wear=fn` → 20,
  `game=dota2&rarity=arcana` → 10, `game=tf2` → 20, `q=dragon` → 3,
  `min=500` → 27, `page=7` → "Showing 145 - 161 of 161". All 162 item pages 200.
- `tsc`, `eslint` and `next build` clean.

**Not visually checked.** There is no Chrome or Chromium on this machine, so
the Recharts render was verified by data contract and HTTP status, not by
looking at it. Worth a browser pass.

## Phase 6 — likes, sharing and the basket

### The watchlist is a list, not just hearts

Hearts already wrote to `watchlist`, but the only place to *see* what you watch
was the tracker board. `watchlist.repository.ts` now returns watched items as
cards — art, grade, the cheapest active copy, its 24h move, seller count — and
the profile gained a **Watchlist tab** beside Showcase and Listings.

It is **private**: buying intent, never shown on someone else's profile.

Each card links to the item, unwatches with its heart, and adds the quoted copy
to the basket. An item nobody is selling reads *No sellers / Unavailable*
rather than quoting a stale price — `floorUsd` and `listingId` are null together.

`getProfile()` loads the watchlist itself rather than taking it from
`profileService.detail()`. The watchlist is keyed on the user and exists without
a `profiles` row, so a fresh sign-up — which falls back to the sample profile —
still sees its own watched items instead of an empty tab.

`watchlistService.watchers(slugs)` counts watchers per item, ready for a
"N watching" line on the item page. Nothing renders it yet.

### Share

`useShare` + `ShareButton`: the OS share sheet where the browser offers one
(`navigator.share`), else the link on the clipboard with a toast, else a hidden
textarea for older Safari and non-secure origins. A dismissed sheet reports as
`AbortError` and passes silently — that's a change of mind, not a failure.

On every marketplace card and on the item page's action row.

### The basket drawer

`shell/cart-button.tsx` was 300+ lines in one file, with native `<button>`s and
Tailwind palette colors (`white/10`, `emerald-400`, `black/80`) against a
project rule that forbids both. Split into `relicto/components/cart/`
(`cart-button`, `cart-line`, `cart-summary`, `cart-assurances`, `cart-empty`),
all under 135 lines, on shadcn controls and design tokens.

Behaviour fixed along with the design:

- **The drawer quoted the wrong total.** It printed `Total = subtotal` with a
  "$0.00 (0% PROMO)" fee row, silently dropping the $25 combo relief the server
  applies at three items. The seeded basket read **$3,688.50** in the drawer and
  charged **$3,648.50**. `CartSummary` now calls the same `quote()` the charge
  uses.
- **"Lock Escrow & Execute Trade" was theatre** — a 1.2s `setTimeout` spinner
  reading "Dispatching Bot Offer…" that dispatched nothing, then navigated to
  `/checkout`. It now says what it does: *Review & settle escrow*.
- The empty state offers a way out (browse the marketplace) instead of a dead panel.

### Fixed in phase 6

- **Every item added from a detail page was labelled as the designed arcana.**
  `PricePanel` hardcoded `badge: "Arcana"`, `game: "Dota 2"`,
  `detail: "Phantom Assassin Weapon Artifact • Style 3 Unlocked"` and a kills
  gem, so an AK-47 added there landed in the basket as a Dota arcana. Every buy
  button now builds its line through `checkout/lib/optimistic-line.ts` from the
  item's own facts; Dota grades get a chip (`ARC`) where CS2 has a wear.
- **The checkout total could go negative.** `settlement-panel.tsx` computed
  `subtotal − combo − promo` by hand instead of calling `quote()`, which clamps
  at zero. A basket cheaper than the $40 of discounts displayed a negative
  *Total Payable* while `placeOrder` charged $0. The panel now uses `quote()`,
  and the discount lines show capped amounts so they reconcile with the total.

### Verified in phase 6

`.verify-lists.mts` — 26 checks: watched cards carry real facts, a floor implies
a buyable copy, slugs and cards agree, watcher counts, the line a watchlist buy
builds keeps its own game/grade, and the drawer's total equals the checkout
panel's and never goes negative.

Through HTTP: the watchlist tab renders its empty state for a new account, then
4 cards once seeded — including one *Unavailable* after its only listing was
flipped to sold and restored. 24 share buttons on a marketplace page.

`tsc`, `eslint` and `next build` clean; the flow (21) and chart (32) suites
still pass.

**Not visually checked** — still no Chrome or Chromium on this machine.

## Phase 7 — buying from the item page, and offers

### The desktop item page buys for real

Until now the desktop item page couldn't buy anything: *Instant Buy* and every
seller-book *BUY NOW* were toasts ("completes once escrow payments are wired"),
and the book itself was fiction — every row read "Relicto Vault · 99.4%".

- **The seller book is the real one.** `items.book.ts` builds it from
  `findItemSellers` (real handle, trust, trade count, bot, intel), cheapest
  first, **without the viewer's own copies** — as on mobile. The hand-authored
  Manifold Paradox page keeps its lore and art but trades on the live book;
  its sample sellers stay only when the catalog doesn't carry the item.
- **Every button reserves a copy.** `use-item-buy.ts`: BUY NOW reserves that
  row's listing and opens `/checkout`; the basket icon (now on every row, not
  only the best) reserves it and stays; Instant Buy quotes and reserves the
  cheapest copy the viewer can buy. `addItem` now resolves once the server
  holds the line, so "buy now" waits for the reservation instead of racing it.
- The footer's authored "124 offers" is the real copy count, and *View all*
  links to the marketplace search. Style pills come from the rows — generated
  items' single "All styles" pill used to hide every row when clicked.
- `getItem` is wrapped in `cache()`: metadata and page no longer query twice.

### Offers (bids)

Migration `0018_offer_book`: `offer_status` gains `withdrawn`, `offers.order_id`
(plain text — `orders` already imports `market`), one open bid per buyer per
copy (partial unique index), and three notification kinds. The migration
collapses older duplicate pending bids first (keeps the highest).

Server module `src/server/modules/offers/`; actions `offers/actions/offers.ts`;
the rules both sides apply live in `offers/lib/bid-rules.ts`.

| Step | What happens |
| --- | --- |
| **Bid** (item page, tag icon on a row) | Copy locked; must be someone else's, active, ≥ 50% of the ask and below it. The vault must cover the bid *now* but **nothing is held**. Bidding again revises the same row. Expires in 72h. Seller notified (`offer_received`, once per distinct amount). |
| **Withdraw** | Buyer only, from the same dialog. |
| **Decline** (studio inbox) | Seller only; buyer notified. |
| **Accept** (studio inbox) | One transaction, locks wallet → listing → offer (checkout's order, so no deadlock with a purchase of the same copy): an escrow order **at the bid price** from `buildOrderRows` — so the tracker, ledger, escrow webhook and payout are unchanged — the buyer's vault debited, the copy reserved, every rival bid declined and told "sold to another bidder". |
| **Buyer can't cover it** at accept time | The bid lapses (`expired`), buyer told; nothing moves. |
| **Lapsed** | Ignored on read; `/api/cron/escrow-timeouts` also retires them (`lapsedOffers` in its answer). |

`buildOrderRows` takes an optional `agreedCents`, which becomes the order's
subtotal — and the subtotal is what `escrow delivered` pays the seller, so an
accepted $X bid pays out $X, not the ask.

`listings.offer_count` is recounted from live rows on every bid write, so a
listing that has been bid on through the app quotes a real "Open Offers" rather
than its seeded number. The studio's "N Offers (Max $X)" now ignores lapsed bids.

**Surfaces.** Item page: the tag icon per row opens the offer dialog; your open
bid shows under the row ("Your offer $95.50 · 2d 23h left"). Seller studio:
an *Incoming Offers* table under the active listings (`/sell#offers`, where
the notification links) with the top bid per copy flagged. No Stitch design
exists for either; both reuse the surrounding tables' language.

**Seed.** Bids now come from three funded bidders (KuroSkins plus two new seed
bidders, $5,000 vaults each) — the old seed had one buyer bid three times on
the same copy. App-made bids (`offer-bid-` ids) and their notifications are
cleared first; accepted-offer orders are `order-chk-` with the trader as
*seller*, so `seedCheckout` now clears those too.

### Verified in phase 7

- `.verify-offers.mts` — 41 checks: inbox, refusals (own / too low / at ask),
  place, revise, recount, notifications, book row carries the bid, own copies
  excluded, withdraw, stranger can't decline, decline, accept (order at the bid,
  vault debit, reserved, rival declined + told, double-accept refused),
  delivery pays the seller the bid, buyer-short, expired, sweep.
- In a browser (Playwright, 1440×900, dev server): offer dialog validation
  ("Bids start at $53.65"), bid sent → row shows the bid; BUY NOW → `/checkout`
  with that copy reserved server-side; studio *Accept $1,580* → toast with the
  order code, inbox drops both Talon bids. No console errors.
- Re-seed restores the designed state (no app bids, orders or notifications;
  studio counts 2/0/3). `tsc`, `eslint`, `next build` clean; the escrow suite
  passes.

### Open after phase 7

- **Mobile can't bid or answer bids yet.** The mobile seller cards buy; there's
  no offer button, and the mobile studio has no inbox.
- **No buyer-side list of open bids.** A bid is visible only on its item page
  and in notifications. A profile tab (like the watchlist) would fix it.
- **Bids aren't held.** Funds are checked at bid time and debited at accept; a
  buyer who spends the vault in between gets `buyer-short`. Holding funds would
  need a ledger hold per bid.
- **Counter-offers** (the studio's "Allow Counter-Offers (Min: $2,950)" toggle)
  are still authored; there's no per-listing minimum, so the global 50% floor
  applies.
- **"Verified Traders (99%+)" is ticked by default** (the design's default), so
  a new trader's copies are hidden from the desktop book until it's unticked.
- `.verify-writes.mts` fails "unknown names stay a custom watch": phase 5's
  catalog added *M4A4 | Howl*, so "Howl" now resolves. Stale test data.
- The checkout suite's one mismatch is the documented vault-balance divergence.
- `seed.ts` is 209 lines (206 before this phase) — over the 200-line rule.
- A stale credential account `claude-qa-demo-login` on the demo trader (from an
  earlier QA session) is still in the dev DB; it blocks password sign-in for
  other temporary QA credentials. Safe to delete.

## Phase 8 — Steam, real prices, search and deposits

### Steam sign-in and inventory sync

- **Sign-in** (`src/lib/steam/`): the redirect to Steam and the rejection of a
  forged assertion (Steam's own `check_authentication` says no →
  `/sign-in?error=steam_unverified`) are verified. A real login needs a human
  at Steam's page. `STEAM_API_KEY` is empty, so new traders are named "Steam
  trader NNNN" with no avatar until it's set (steamcommunity.com/dev/apikey).
- **Steam CDN images**: `next.config.ts` now allows Steam's avatar and item-icon
  hosts. Before this, a Steam user's avatar would have crashed every page's
  header (`next/image` refuses unlisted hosts).
- **Inventory sync** — migration `0019_steam_inventory_sync` (`inventory_syncs`,
  one row per trader: Steam id, last status, count, time). `src/lib/steam/inventory.ts`
  pulls `steamcommunity.com/inventory/{id}/{730|570|440}/2`; `inventory-sync/`
  mirrors marketable items into `inventory_items` (asset ids `730-…`), matches the
  catalog by name for floors, and in one transaction prunes copies that left
  Steam — cancelling their active listing — while never touching seeded or
  trade-up-forged rows or a game Steam didn't answer.
  - First `/sell` visit pulls inline; later visits refresh a >15-min mirror in
    `after()`; the rail's "Steam Sync: 4m ago" is a button (≤1 pull/min).
  - A Steam trader always sees their own studio (an empty one says why:
    private inventory, or nothing marketable); only non-Steam accounts get the
    sample studio.
  - **Steam 429s Node's default User-Agent** on the first request; the client
    sends a named one. Games are pulled 1.5 s apart, and a game Steam skips is
    reported (`skipped`) and left as it was.

### Real price history

`/items/[slug]` charted the seed's generated series (or nothing: 10 items had
none). Now:

- **Daily market snapshot** — `/api/cron/price-feed` (04:30 daily, `vercel.json`)
  records each catalog item's lowest Skinport ask as a `skinport` price point,
  one id per item per day (re-runs update). CS2 is quoted at the exterior
  Relicto sells. First run: 68/71 CS2, 8/20 TF2, 5/71 Dota 2 (the generated Dota
  names mostly don't exist on real markets).
- **Relicto sales** — `escrow delivered` records the settled price (`pp-sale-<code>`).
- **The chart** plots only those: the market line, sales as markers, stats that
  name their source. With fewer than two observations it says "Price history is
  building" instead of drawing an empty frame. It fills in a day at a time.
- Tracker and alerts are pinned to `venue = 'relicto'`, so their seeded series
  don't mix with market data. `db:seed` no longer deletes real observations.
- Empty "Item specification" cards and the replay clip (an unrelated AK
  screenshot) are hidden on catalog-built items; "SET PING" creates a real alert rule.

**No free backfill exists**: Steam's `pricehistory` needs a logged-in Steam
cookie, and its listing page no longer embeds history for anonymous visitors.

### Search

`GET /api/search?q=&game=&rarity=&wear=&min=&limit=` (signed-in) returns items
with a live copy (cheapest copy, float, seed, Relicto floor vs Steam/Skinport
reference), traders by handle, tournaments by name, and per-game counts.
Multi-word queries match every term against item or hero name; `%`/`_` are
escaped. An empty query returns the biggest movers.

The command palette (`src/modules/search/`, from `docs/design/`) opens from
every header's field — the whole box is the trigger, since some headers squeeze
the input to 0 px — and from ⌘K / Ctrl+K and "/". ↑↓ move, Enter opens (or
searches the marketplace), Tab baskets the cheapest copy, recents live in
localStorage. Deviations from the design: a TF2 pill instead of the
"Pro Traders"/"Tournaments" scope pills; the sticker/trade-hold/escrow chips are
omitted (no data behind them); the footer shows measured query time instead of
authored telemetry; traders' "View Backpack" is a roadmap notice (no public
storefront page yet).

### Wallet deposits (test mode)

`walletService.deposit` credits the vault when `mockPaymentsEnabled()` — outside
production unless `CHECKOUT_MOCK_PAYMENTS=false`, and in production only with
`CHECKOUT_MOCK_PAYMENTS=true`. Otherwise it answers `rail-unavailable`: balance is
never minted in production by accident. $10–$10,000; opens a vault for a new
trader; refuses a frozen one; ledger row "… Deposit (simulated) — nothing was
charged" (`ledger-dep-` ids, undone by the seed). The deposit panel shows a
test-mode strip; the +2% booster applies to the skins rail only, which points to
the Sell Studio.

### Verified in phase 8

`.verify-steam-sync.mts` (real Steam: 231 items, pruning, listing cancel,
forged rows kept, private inventory), `.verify-price-feed.mts`,
`.verify-search.mts`, `.verify-deposit.mts` (10 checks incl. the production
guard). In Chromium: palette via ⌘K and header click, ↓ highlight, trader
cards, Blaze chart empty state, a $100 test deposit ($3,140 → $3,240). No
console errors. `tsc`, `eslint`, `next build` clean.

### Open after phase 8

- **Seeded prices are far from the market** (Dragon Lore $5,200 vs $11,538 on
  Skinport); the search shows those gaps honestly.
- New Steam traders get no `profiles` row or wallet until they act (the first
  deposit opens the wallet); profile bootstrap on sign-up is next.
- Mobile has no palette trigger beyond the hotkeys; mobile deposit is untouched.
- Public trader storefronts, a Stitch design each: see the design list.

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

- ~~Nothing fires the 180-second auto-cancel.~~ Escrows expire on read, and
  `/api/cron/escrow-timeouts` sweeps the rest. Vercel Hobby only allows a daily
  cron, so an unread escrow can outlive its window by up to a day.
- ~~Trade-ups aren't backed by the database.~~ Phase 4.

Still open:

- ~~Offers don't notify yet.~~ Phase 7: `offer_received`, `offer_accepted`,
  `offer_declined`.
- **iOS push needs an installed web app**: a manifest and 192/512px icons.
  There is no PNG brand icon in `public/` yet, so OS notifications use the
  site default.
- **Authored copy that now lies on live data:** the checkout breadcrumb's
  "Active Cart (3)", the combo banner's fixed `-$25.00`, the dispatch modal's
  three named Sentinels, and the results toolbar's "Telemetry updated 3 seconds
  ago via Steam Trading Node #8" (nothing measures it).
- **Facet counts ignore sibling facets.** `countFacets()` is scoped to the
  selected ecosystem only, so a rarity tally doesn't narrow when a wear tier is
  ticked. Proper faceted counts need one query per facet.
- **Generated catalog art repeats** — eight images across 144 items.
- **Mobile has no watchlist tab or share button.** Phase 6 is desktop-only; the
  mobile profile composition still shows its own quick-links.
- **`watchlistService.watchers()` has no UI.** The count is queryable; nothing
  renders "N watching" yet.
- **The drawer assumes the promo is applied**, as the checkout panel does. If a
  buyer removes it at checkout the total rises by $15 from what the drawer showed.
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
- Steam sign-in: plugin written (`src/lib/steam/`), round trip not yet verified
- `additionalFields` / `username` plugin, 2FA, email verification and reset
- `/verify` and `/reset-password` are still static mockups
