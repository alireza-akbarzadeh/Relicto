# Design sources

Stitch project: `16773524343330526083`. It's available through the `stitch` MCP server (local scope).
To build a screen, follow **[IMPLEMENTING.md](IMPLEMENTING.md)**.

## Desktop screens (`stitch/lootora/`, rendered at 1280px)

| Export | Route | Status |
| --- | --- | --- |
| `hub/` (Game Hub & Meta Intel) | `/` | Done, 3.1% diff |
| `marketplace-item-discovery-trading-hub` | `/marketplace` | Done, 1.6% diff |
| `sign-in-steam-gateway` | `/sign-in` | Done, 1.3% diff |
| `create-account-inventory-bind` | `/sign-up` | Done (8.3%: copy edits by design owner) |
| `steam-guard-2fa-verification` | `/verify` | Done, 2.7% diff |
| `reset-password-recovery` | `/reset-password` | Done (6.0%: brand rename reflows title) |
| `user-profile-trader-identity` | `/profile` | Done, 4.3% diff |
| `order-history-trade-ledger` | `/orders` | Done, 3.6% diff |
| `live-order-tracking-escrow-protocol` | `/orders/[id]` | Done, 1.7% diff |
| `sell-items-inventory-listing-studio` | `/sell` | To do |
| `wallet-income-payout-dashboard` | `/wallet` | To do |
| `tracker/` (price tracker) | `/tracker` | To do |
| `checkout/` | `/checkout` | To do |
| `item-detail-phantom-assassin-manifold-paradox` | `/items/[slug]` | Export is a Google sign-in page. Re-pull from Stitch, or build from the mobile design. |

## Mobile screens (`stitch/mobile/`)

Rendered at 390px. Each route renders the mobile composition below `md` and the desktop one above it (see `/tournaments`).
Diffs are against the export rendered locally (`scripts/design/shoot.mjs <url> <out> 390 884`).

| Export | Route | Status |
| --- | --- | --- |
| `lootora_mobile_marketplace_trading_hub` | `/marketplace` | Done, 0.92% |
| `lootora_mobile_item_detail_pa_manifold_paradox` | `/items/[slug]` | Done, 1.30% (design toast leaks into the capture) |
| `lootora_mobile_real_time_price_tracker_arbitrage_terminal` | `/tracker` | Done, 0.62% |
| `lootora_mobile_live_order_tracker_escrow_protocol` | `/orders/[id]` | Done, 0.40% |
| `lootora_mobile_user_profile_trader_identity` | `/profile` | Done, 0.87% |
| `lootora_mobile_esports_meta_hub` | `/` | Done, 4.94% (design's hidden predict sheet leaks into the capture) |
| `lootora_mobile_wallet_instant_cashout` | `/wallet` | Done, 0.88% |
| `lootora_mobile_price_alerts_sniper_bots` | `/alerts` | Done, 3.04% (new-rule button sits above the tab bar on purpose) |
| `lootora_mobile_liquidation_trade_up` | `/sell` | Done, 0.70% |
| `lootora_mobile_escrow_checkout` | `/checkout` | Done; lines come from the live cart, so item text differs |
| `lootora_mobile_steam_auth_security_gateway` | `/sign-in` | Done, 1.01% (prefilled credentials left empty) |
| `lootora_mobile_steam_guard_2fa` | `/verify` | Done, 1.77% (code starts empty) |
| `lootora_mobile_sign_in_steam_gateway` | — | Alternate sign-in variant with a generic header; not used |
| `stitch_valve_esports_tournament_hub` | `/tournaments` | Done (arena) |

Four exports (hub, wallet, alerts, trade-up) request `Space Grotesk` and `JetBrains Mono` at `wght@100..900`,
which Google Fonts rejects, so Stitch drew them in a serif fallback. The pages use the design-system fonts;
diff against a copy with the ranges fixed (`100..800` / `300..700`).

## Esports arena (`stitch/arena-*.html`)

`arena-desktop` (1488px) and `arena-mobile` (390px) are implemented at `/tournaments`.
