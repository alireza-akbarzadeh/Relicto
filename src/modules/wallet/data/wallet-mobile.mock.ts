import type { WalletMobile } from "../mobile.types";

const img = (n: number) => `/images/lootora/wallet-mobile-0${n}.jpg`;

/** Mobile wallet payload. The headline balance is derived (available + escrow). */
export const walletMobile: WalletMobile = {
  vault: { label: "Cold Storage Active", keys: "5 of 7 Multi-Sig Keys", mode: "AIRGAPPED" },
  changePct: 14.2,
  pnlUsd: 532.1,
  sync: "12s ago",
  availableUsd: 3449.5,
  escrowUsd: 840,
  escrowNote: "Clearing in 48h",
  actions: [
    { id: "deposit", label: "Deposit", icon: "add_circle", tone: "plain" },
    { id: "cashout", label: "Cashout", icon: "bolt", tone: "crimson" },
    { id: "send", label: "P2P Send", icon: "swap_horizontal_circle", tone: "indigo" },
    { id: "freeze", label: "Freeze", icon: "ac_unit", tone: "error" },
  ],
  rails: [
    { id: "steam", icon: "sports_esports", tone: "amber", title: "Steam Inventory Instant Liquidation", chip: "0% FEE", chipTone: "crimson", note: "CS2 & Dota 2 Trade URL Auto-Scan • 3s payout" },
    { id: "crypto", icon: "currency_bitcoin", tone: "indigo", title: "Direct Crypto Rails", chip: "INSTANT", chipTone: "indigo", note: "USDT (TRC-20), BTC SegWit, SOL network" },
    { id: "card", icon: "credit_card", tone: "rose", title: "Card & Apple Pay", chip: "1.2% FEE", chipTone: "muted", note: "Visa, Mastercard, Revolut Instant Top-Up" },
    { id: "wire", icon: "account_balance", tone: "plain", title: "SEPA Instant / ACH Wire", chip: "0-24H", chipTone: "muted", note: "High volume tier-1 European & US accounts" },
  ],
  ledger: {
    total: 37,
    entries: [
      {
        id: "tx-88291", category: "trades", image: img(1), imageAlt: "Karambit Doppler Phase 2", game: { label: "CS2", tone: "crimson" },
        title: "★ Karambit | Doppler (Phase 2)", status: { label: "0d Escrow Cleared", tone: "amber", strong: false }, ref: "Trade #88291", refMono: false,
        amountUsd: 1450, amountTone: "amber", when: "Today, 14:22", whenTone: "secondary",
      },
      {
        id: "tx-usdt", category: "deposits", image: img(2), imageAlt: "USDT deposit", title: "USDT TRC-20 Deposit",
        status: { label: "Completed", tone: "indigo", strong: true }, ref: "Tx: 0x8a...4f2c", refMono: true,
        amountUsd: 500, amountTone: "rose", when: "Yesterday", whenTone: "secondary",
      },
      {
        id: "tx-manifold", category: "escrow", image: img(3), imageAlt: "Manifold Paradox arcana", game: { label: "DOTA", tone: "indigo" },
        title: "Manifold Paradox Arcana", status: { label: "Pending Valve", tone: "cyan", strong: false }, ref: "Bot #4", refMono: false,
        amountUsd: 42.5, amountTone: "plain", when: "Oct 28", whenTone: "muted",
      },
    ],
  },
};
