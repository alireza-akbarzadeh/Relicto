# Relicto — Site Completion Roadmap & Execution Progress

This document serves as the master execution tracker for bringing **Relicto** from its current feature-complete development baseline to full production deployment.

---

## Progress Overview

| Phase / Milestone | Status | Focus Area | Key Deliverables |
| :--- | :---: | :--- | :--- |
| **Foundations & Core Domains** | ✅ Complete | Mocks → Postgres DB | Auth, Marketplace, Orders, Escrow, Tournaments, Community, Mobile Parity (23 migrations) |
| **Milestone 1: Financial Hardening** | ✅ Complete | Wallet & Bids | Bid Escrow Holds, Overcommitment Protection, Uncommitted Liquidity Sync |
| **Milestone 2: Collection Trade-Ups** | ✅ Complete | CS2 Trade-Up Engine | Canonical Weapon Collections, Dynamic Odds Matrix, Wear Float Transfer |
| **Milestone 3: Unique Catalog Art** | ✅ Complete | Catalog Media Depth | Elimination of repeating item shots, authentic game renders for all 162 items |
| **Milestone 4: Live Payment Rails** | ✅ Complete | Fiat & Crypto Gateways | Stripe Checkout Session webhook, Web3 Crypto payment listener, Vault auto-credit |
| **Milestone 5: Steam Trade Daemon** | ✅ Complete | Physical Asset Bots | Worker daemon architecture connecting `/api/escrow/events` to real Steam trade sessions |

---

## Milestone 1: Financial Integrity — Bid Escrow Holds & Balance Protection ✅ Done

### Objectives
Currently, incoming buyer bids verify vault liquidity at placement and only debit upon seller acceptance. If a trader places multiple bids across different listings or spends their balance on checkout, an accepted bid can fail as `buyer-short`. 

### Execution Tasks:
1. **Uncommitted Liquid Balance Tracking**:
   - Calculate total committed funds locked in active pending bids (`status = 'pending'` and `expiresAt > now()`).
   - Derive `uncommittedCents = balanceCents - activeBidHoldsCents`.
2. **Bid Placement & Revision Enforcement**:
   - In `makeOffer` ([offers.commands.ts](file:///c:/Users/akbarzadeh.ali/Relicto/src/server/modules/offers/offers.commands.ts)): Ensure buyer's uncommitted balance covers new bids or the incremental delta on revisions.
   - Prevent placing bids that exceed available uncommitted vault liquidity.
3. **Cart Checkout & Cashout Coordination**:
   - Ensure checkout payments and instant cashouts respect uncommitted balances or release open bids if explicitly requested.
4. **Acceptance Guarantee**:
   - Once a seller accepts an offer, the buyer's funds are guaranteed to be present, eliminating `buyer-short` failures.
5. **Wallet Metrics Display**:
   - Reflect committed bid funds clearly in desktop and mobile treasury metrics without breaking UI types.

---

## Milestone 2: Authentic CS2 Weapon Collections for Trade-Up Chamber ✅ Done

### Objectives
The Trade-Up Chamber currently draws from a generic per-game outcome pool. In Counter-Strike 2, trade-up contracts require items from specific collections and calculate outcomes dynamically from the next tier of those exact collections.

### Execution Tasks:
1. **Schema Extension**:
   - Add `collection` / `collection_id` to `items` table (e.g. *Cobblestone*, *The Dust 2 Collection*, *Dreams & Nightmares*).
2. **Dynamic Outcome Odds Engine**:
   - Parse the 10 committed input items in the forge deck.
   - For each input item from Collection $C$, identify all available weapons of the next rarity grade in $C$.
   - Calculate exact mathematical probabilities proportional to the number of eligible outcomes per collection.
3. **Float & Wear Inheritance**:
   - Apply CS2 formula: $\text{Outcome Float} = (\text{Avg Input Float} \times (\text{Max Float} - \text{Min Float})) + \text{Min Float}$.
4. **Seed Enrichment**:
   - Tag catalog items with authentic CS2 collection metadata.

---

## Milestone 3: Catalog Media Depth & Unique Artwork ✅ Done

### Objectives
All 162 catalog items resolve without error, but 144 generated items share 8 fallback images.

### Execution Tasks:
1. **High-Fidelity Artwork Mapping**:
   - Mapped bespoke visual assets across CS2 knife families (Karambit Doppler, Butterfly Doppler, Talon Knife, Butterfly Fade, M9 Bayonet), rifles (AK-47 Redline, Vulcan, Bloodsport, Case Hardened, Fire Serpent, M4A4 Howl, The Emperor, M4A1-S Hyper Beast, Player Two), sidearms (Desert Eagle Printstream, Fennec Fox, USP-S Kill Confirmed, Glock-18 Water Elemental, High Beam), snipers (AWP Dragon Lore, Wildfire, Asiimov, Fade, SSG Blood in the Water), and gloves (Sport Gloves Vice, Specialist Gloves Fade, Crimson Web).
   - Dota 2 Arcana and Immortal hero models mapped (Pudge Feast of Abscession, Crystal Maiden Frost Avalanche, Phantom Assassin Manifold Paradox & Asan Persona, Juggernaut Bladeform Legacy, Invoker Dark Artistry).
   - TF2 Australium Rocket Launcher, Class headgear (Burning/Scorching unusuals), and specialized loadouts mapped.
2. **Seed Pipeline Enrichment**:
   - Modularized into `catalog-artwork.ts` and `catalog-presentation.ts`, resolving 34 distinct authentic assets across all 162 catalog items without cross-game fallback leaks.

---

## Milestone 4: Production Payment Gateways ✅ Done

### Objectives
Transition from test-mode payments (`CHECKOUT_MOCK_PAYMENTS`) to live financial rails with verified signatures and automated ledger settlement.

### Execution Tasks:
1. **Stripe Integration**:
   - Implemented standard `/api/webhooks/stripe` route with HMAC signature verification.
   - Settled card deposits and basket orders with `venue = 'stripe'` in `ledgerEntries` and exact Stripe session reference tracking.
   - Maintained backward compatibility with `/api/checkout/stripe/webhook`.
2. **Web3 Crypto Gateways**:
   - Added dedicated user deposit address derivation (`/api/crypto/address`) for USDT (TRC-20, Arbitrum, Base), Ethereum, Solana, and Bitcoin (Native SegWit).
   - Added transaction verification and auto-settlement endpoint (`/api/crypto/verify`) with idempotency and confirmation threshold enforcement.
   - Implemented incoming blockchain listener webhook (`/api/webhooks/crypto`) with bearer authentication.
   - Updated client UI modals (`CryptoModal` and `WalletDeposit`) to fetch and display the trader's dedicated on-chain address.

---

## Milestone 5: Autonomous Steam Trade Bot Daemon ✅ Done

### Objectives
Automate the physical delivery of items between buyers, sellers, and Relicto Sentinel Bots.

### Execution Tasks:
1. **Sentinel Bot Pool & Trade Offer Queue**:
   - Created `SteamDaemonService` (`steam-daemon.service.ts`) managing Sentinel bot load balancing, anti-phishing security token generation (`SEC-XXXX`), and Valve Steam offer identifiers.
2. **Autonomous Dispatch & Escrow Webhook Integration**:
   - Automated queue scanning for active escrow orders without dispatched trade offers.
   - Integrated with `/api/escrow/events` (`offer_sent`, `delivered`, `cancelled`) to advance escrow timeline steps and dispatch buyer mobile push notifications.
3. **Execution Harness**:
   - Added scheduled cron endpoint (`/api/cron/steam-daemon`) with bearer secret verification.
   - Added standalone runner script (`scripts/steam-bot-daemon.ts`) and `pnpm daemon:steam` npm script supporting single-pass and continuous loop polling (`--loop`).
