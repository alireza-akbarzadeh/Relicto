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
| `/alerts` | mock | ☐ step 2 |
| `/tracker` | mock | ☐ step 3 |
| `/sell` | mock | ☐ step 4 |
| `/checkout` | mock | ☐ step 5 |
| `/tournaments` | mock | ☐ step 6 |
| mobile compositions | mock | ☐ step 7 |

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
the trader, so **`/marketplace` now returns 14 cards instead of 8**. The eight
original cards were re-verified and are unchanged.

### Step 2 — `/alerts`

Table: `alerts`. Sniper rules, telemetry and dispatch channels. Needs a rule
model (item + threshold + channel) and a fired-alert log.

### Step 3 — `/tracker`

Tables: `price_points`, `watchlist`, `offers`. The depth book and arbitrage
cards are the first screens that need real time-series aggregation rather than
row-by-row reads.

### Step 4 — `/sell`

Tables: `listings`, `items`, `trade_up_contracts`. Seller studio: inventory,
draft listings, trade-up contracts. Needs a Steam inventory stand-in until the
real sync exists.

### Step 5 — `/checkout`

Tables: `cart_items`, `orders`. The first screen that *writes*, so it needs
Server Actions over the services, not just reads.

### Step 6 — `/tournaments`

Tables: `tournaments`, `teams`, `matches`, `predictions`. Route sits outside
`(lootora)` and has no session requirement.

### Step 7 — mobile compositions

Every page ships a separate mobile composition switched by CSS at `md`. These
still read their own mocks and need the same treatment, reusing the services
already built.

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

## Still missing from `backend-plan.md`

Unchanged by this work, listed so it is not lost:

- `src/lib/env.ts` zod validation
- Steam sign-in (OpenID 2.0 plugin)
- `additionalFields` / `username` plugin, 2FA, email verification and reset
- `/verify` and `/reset-password` are still static mockups
