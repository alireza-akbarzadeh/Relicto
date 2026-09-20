import type { WalletData } from "../types";

export const wallet: WalletData = {
  netEquity: "$4,289.50",
  equityChange: "+14.8%",
  equityNote: "+$552.10 USD (Past 24h market & trade-ups)",
  metrics: [
    { id: "liquid", label: "Available Liquid Balance", icon: "account_balance_wallet", value: "$3,140.00", description: "Immediately withdrawable via instant SEPA / Crypto rail.", foot: "UNRESTRICTED · Tier: Whitelisted", tone: "muted", live: true },
    { id: "escrow", label: "Active Escrow Lock", icon: "lock_clock", value: "$868.50", description: "Held across 2 pending Steam bot trade confirmations.", foot: "BOT #04 & #12 HOLD · Expires in 6h 34m", tone: "amber" },
    { id: "settlement", label: "Trade-Up Settlements", icon: "hourglass_top", value: "$281.00", description: "Clearing from completed Classified contract liquidation.", foot: "FINAL AUDIT STAGE · Clearing in 4h 12m", tone: "cyan" },
    { id: "rebates", label: "Rebates & Rewards", icon: "military_tech", value: "$42.20", description: "Gold Tier 0.5% fee discount credit applied automatically.", foot: "GOLD REBATE ACTIVE · Next Tier at $10k Vol", tone: "primary" },
  ],
  depositRails: [
    { id: "crypto", label: "Web3 Crypto", icon: "currency_bitcoin" },
    { id: "skins", label: "Steam Skins", icon: "backpack" },
    { id: "cards", label: "Cards / Apple", icon: "credit_card" },
    { id: "bank", label: "SEPA / Wire", icon: "account_balance" },
  ],
  cashoutRails: [
    { id: "usdt", label: "USDT (TRC20)", icon: "toll" },
    { id: "sepa", label: "SEPA Instant", icon: "account_balance" },
    { id: "keys", label: "Steam Keys", icon: "confirmation_number" },
    { id: "visa", label: "Visa Direct", icon: "credit_card" },
  ],
  transactions: [
    { id: "tx-9841209", icon: "arrow_outward", title: "Instant Cashout (USDT TRC20)", hash: "#TX-9841209", asset: "0x71C92a46B9f76D...91823B492", detail: "Tron Protocol Network", node: "Dispatched in 42s", amount: "-$850.00", amountTone: "primary", status: "COMPLETED", statusTone: "live", action: "TronScan", actionIcon: "open_in_new" },
    { id: "tx-9840884", icon: "arrow_inward", title: "P2P Skin Sale Credit", hash: "#TX-9840884", asset: "★ Butterfly Knife | Doppler (Phase 4)", detail: "Buyer: @Kuro_Vault (Verified)", node: "Steam Escrow Bot #14", amount: "+$3,150.00", amountTone: "amber", status: "SETTLED", statusTone: "live", action: "Receipt", actionIcon: "receipt_long" },
    { id: "tx-9839912", icon: "credit_card", title: "Instant Card Ingress", hash: "#TX-9839912", asset: "Visa ending in 4092", detail: "Stripe 3DS Escrow Engine", node: "Direct Settlement Gateway", amount: "+$500.00", amountTone: "amber", status: "COMPLETED", statusTone: "live", action: "Invoice", actionIcon: "open_in_new" },
    { id: "tx-9837102", icon: "shopping_bag", title: "Marketplace Item Acquire", hash: "#TX-9837102", asset: "Manifold Paradox (Phantom Assassin Arcana)", detail: "Exalted Level 3 Unlocked", node: "Steam Escrow Bot #03", amount: "-$118.50", amountTone: "primary", status: "DELIVERED", statusTone: "cyan", action: "Inspect", actionIcon: "visibility" },
    { id: "tx-9835210", icon: "finance_mode", title: "Trade-Up Surplus Liquidation", hash: "#TX-9835210", asset: "14 Mil-Spec Trade-Up Remains", detail: "Instant Platform Liquidation Option", node: "Internal Market Maker", amount: "+$612.80", amountTone: "amber", status: "COMPLETED", statusTone: "live", action: "Logs", actionIcon: "receipt_long" },
    { id: "tx-9831004", icon: "sync", title: "SEPA Instant Clearing", hash: "#TX-9831004", asset: "IBAN ending in DE89", detail: "Revolut Banking AG", node: "Escrow Bot Multi-Sig", amount: "-$1,200.00", amountTone: "amber", status: "PROCESSING", statusTone: "live", action: "Tracker", actionIcon: "radar" },
  ],
};
