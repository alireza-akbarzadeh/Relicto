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

| Export | Status |
| --- | --- |
| `lootora_mobile_marketplace_trading_hub` | To do |
| `lootora_mobile_item_detail_pa_manifold_paradox` | To do |
| `lootora_mobile_live_order_tracker_escrow_protocol` | To do |
| `lootora_mobile_real_time_price_tracker_arbitrage_terminal` | To do |
| `lootora_mobile_steam_auth_security_gateway` | To do |
| `lootora_mobile_user_profile_trader_identity` | To do |
| `stitch_valve_esports_tournament_hub` (Steam Intel Exchange & esports trading) | To do |

## Esports arena (`stitch/arena-*.html`)

`arena-desktop` (1488px) and `arena-mobile` (390px) are implemented at `/tournaments`.
