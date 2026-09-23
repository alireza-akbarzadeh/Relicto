import type { CheckoutMobile } from "../mobile.types";

/** Mobile checkout payload. Lines come from the cart; totals and balances are derived. */
export const checkoutMobile: CheckoutMobile = {
  vaultUsd: 4289.5,
  ethUsd: 3480,
  reserveSeconds: 299,
  handshake: { status: "Steam Trade URL Synced", hold: "0-DAY HOLD VERIFIED", passphrase: "NEO-TITAN-CYAN-88" },
  rails: [
    { id: "vault", label: "Vault Balance", icon: "account_balance_wallet", tone: "rose", feePct: 0 },
    { id: "crypto", label: "USDT / Web3", icon: "currency_bitcoin", tone: "indigo", note: "Multi-Sig", feePct: 0 },
    { id: "card", label: "Card / Stripe", icon: "credit_card", tone: "muted", note: "+1.8% fee", feePct: 1.8 },
  ],
  dock: { ping: "18ms · READY", hold: "0 SEC (INSTANT)" },
};
