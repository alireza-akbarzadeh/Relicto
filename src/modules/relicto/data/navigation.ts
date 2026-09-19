import type { NavItem } from "../session-types";

/** Top navigation per header family, in the order each Stitch screen shows it. */
export const MARKET_NAV: NavItem[] = [
  { id: "marketplace", label: "Marketplace", href: "/marketplace" },
  { id: "wiki", label: "Wiki", href: "/wiki", comingSoon: true },
  { id: "tracker", label: "Tracker", href: "/tracker", comingSoon: true },
  { id: "portfolio", label: "Portfolio / Inventory", href: "/profile" },
  { id: "community", label: "Community", href: "/community", comingSoon: true },
  { id: "price-alerts", label: "Price Alerts", href: "/alerts", comingSoon: true },
];

export const LEDGER_NAV: NavItem[] = [
  { id: "marketplace", label: "MARKETPLACE", href: "/marketplace" },
  { id: "orders", label: "ORDERS & ESCROW", href: "/orders" },
  { id: "inventory", label: "INVENTORY", href: "/profile" },
  { id: "price-tracker", label: "PRICE TRACKER", href: "/tracker", comingSoon: true },
  { id: "community", label: "COMMUNITY", href: "/community", comingSoon: true },
];

export const STUDIO_NAV: NavItem[] = [
  { id: "marketplace", label: "Marketplace", href: "/marketplace" },
  { id: "wiki", label: "Wiki", href: "/wiki", comingSoon: true },
  { id: "tracker", label: "Tracker", href: "/tracker", comingSoon: true },
  { id: "inventory", label: "Inventory", href: "/profile" },
  { id: "sell", label: "Sell Items", href: "/sell" },
  { id: "wallet", label: "Wallet & Income", href: "/wallet" },
  { id: "community", label: "Community", href: "/community", comingSoon: true },
];

/** Account menu shared by every header. */
export const ACCOUNT_LINKS = [
  { href: "/profile", label: "Trader Profile", icon: "person" },
  { href: "/orders", label: "Orders & Escrow", icon: "receipt_long" },
  { href: "/wallet", label: "Wallet & Income", icon: "account_balance_wallet" },
  { href: "/sell", label: "Sell Items", icon: "sell" },
  { href: "/verify", label: "Security & Steam Guard", icon: "shield_lock" },
] as const;
