import type { NavItem } from "../session-types";

/** Top navigation per header family, in the order each Stitch screen shows it. */
export const MARKET_NAV: NavItem[] = [
  { id: "marketplace", label: "Marketplace", href: "/marketplace" },
  { id: "wiki", label: "Wiki", href: "/wiki" },
  { id: "tracker", label: "Tracker", href: "/tracker" },
  { id: "portfolio", label: "Portfolio / Inventory", href: "/profile" },
  { id: "community", label: "Community", href: "/community" },
  { id: "price-alerts", label: "Price Alerts", href: "/alerts" },
];

export const LEDGER_NAV: NavItem[] = [
  { id: "marketplace", label: "MARKETPLACE", href: "/marketplace" },
  { id: "orders", label: "ORDERS & ESCROW", href: "/orders" },
  { id: "inventory", label: "INVENTORY", href: "/profile" },
  { id: "price-tracker", label: "PRICE TRACKER", href: "/tracker" },
  { id: "community", label: "COMMUNITY", href: "/community" },
];

export const STUDIO_NAV: NavItem[] = [
  { id: "marketplace", label: "Marketplace", href: "/marketplace", icon: "storefront" },
  { id: "wiki", label: "Wiki", href: "/wiki", icon: "menu_book" },
  { id: "tracker", label: "Tracker", href: "/tracker", icon: "monitoring" },
  { id: "inventory", label: "Inventory", href: "/profile", icon: "inventory_2" },
  { id: "sell", label: "Sell Items", href: "/sell", icon: "sell" },
  { id: "wallet", label: "Wallet & Income", href: "/wallet", icon: "account_balance_wallet" },
  { id: "community", label: "Community", href: "/community", icon: "groups" },
];

/** Game hub (home). */
export const HUB_NAV: NavItem[] = [
  { id: "marketplace", label: "Marketplace", href: "/marketplace" },
  { id: "wiki", label: "Wiki", href: "/wiki" },
  { id: "tracker", label: "Tracker", href: "/tracker" },
  { id: "inventory", label: "Inventory", href: "/profile" },
  { id: "sell", label: "Sell Items", href: "/sell" },
  { id: "wallet", label: "Wallet & Income", href: "/wallet" },
  { id: "hub", label: "Game Hub", href: "/" },
  { id: "community", label: "Community", href: "/community" },
];

/** Account menu shared by every header. */
export const ACCOUNT_LINKS = [
  { href: "/profile", label: "Trader Profile", icon: "person" },
  { href: "/orders", label: "Orders & Escrow", icon: "receipt_long" },
  { href: "/wallet", label: "Wallet & Income", icon: "account_balance_wallet" },
  { href: "/sell", label: "Sell Items", icon: "sell" },
  { href: "/verify", label: "Security & Steam Guard", icon: "shield_lock" },
] as const;
