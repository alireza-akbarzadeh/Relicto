import type { PaymentRail } from "@/modules/checkout/types";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Rails are platform configuration, the same for every trader — only the vault
 * rail quotes a per-account figure.
 */
export const PAYMENT_RAILS = (balanceCents: number): PaymentRail[] => [
  {
    id: "relicto",
    title: "Lootora Vault Balance",
    detail: `Avail: ${money(balanceCents)} USD`,
    note: "Instant 0% fee execution",
    icon: "account_balance_wallet",
    badge: "Fastest",
    tone: "cyan",
  },
  {
    id: "crypto",
    title: "Web3 Crypto / Steam Pay",
    detail: "USDT • BTC • SOL • ETH",
    note: "Immediate on-chain settlement",
    icon: "currency_bitcoin",
    badge: "0% Gas",
    tone: "amber",
  },
  {
    id: "steam",
    title: "Steam Balance Split",
    detail: "$142.50 Steam + Balance Card",
    note: "Split Rail",
    icon: "account_balance",
    tone: "muted",
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    detail: "Visa, Mastercard, Apple Pay",
    note: "3D Secure",
    icon: "credit_card",
    tone: "muted",
  },
];

/**
 * A stable handle for the basket as it currently stands. Derived from the cart
 * rows, so it survives a reload and changes the moment the basket does — no
 * session row to create, expire or clean up.
 */
export function sessionCode(cartIds: string[]): string {
  const digest = cartIds
    .join("|")
    .split("")
    .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 100000, 7);

  return `#CHK-${String(digest).padStart(5, "0")}-ES`;
}
