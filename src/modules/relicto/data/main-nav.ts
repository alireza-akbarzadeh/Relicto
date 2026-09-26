import type { IconName } from "@/components/ui/icon";

export type MainNavLink = { href: string; label: string; description: string; icon: IconName };

/** A top-level entry: a section that opens a panel of links, or a single destination. */
export type MainNavSection =
  | { id: string; label: string; icon: IconName; links: MainNavLink[] }
  | { id: string; label: string; icon: IconName; href: string };

/**
 * The one desktop navigation every header shares. Four entries instead of
 * seven-plus side by side: related pages share a section, and each section
 * opens its own panel with room for a line on what the page is for.
 */
export const MAIN_NAV: MainNavSection[] = [
  {
    id: "market",
    label: "Market",
    icon: "storefront",
    links: [
      { href: "/marketplace", label: "Marketplace", description: "Every live listing, with real filters and escrow checkout.", icon: "storefront" },
      { href: "/tracker", label: "Price Tracker", description: "Order books, spreads and your watched items.", icon: "monitoring" },
      { href: "/alerts", label: "Price Alerts", description: "Get pinged the moment a price drops under yours.", icon: "notifications_active" },
      { href: "/wiki", label: "Wiki", description: "Item lore, patches and trading guides.", icon: "menu_book" },
    ],
  },
  {
    id: "trade",
    label: "Trade",
    icon: "sell",
    links: [
      { href: "/sell", label: "Sell Items", description: "List your Steam inventory, answer offers, run trade-ups.", icon: "sell" },
      { href: "/orders", label: "Orders & Escrow", description: "Track every purchase and sale until it settles.", icon: "receipt_long" },
      { href: "/profile", label: "Inventory", description: "Your showcase, storefront and watchlist.", icon: "inventory_2" },
    ],
  },
  { id: "wallet", label: "Wallet", icon: "account_balance_wallet", href: "/wallet" },
  {
    id: "community",
    label: "Community",
    icon: "groups",
    links: [
      { href: "/community", label: "Community", description: "Trader posts, market talk and highlights.", icon: "groups" },
      { href: "/tournaments", label: "Tournaments", description: "Live brackets, prize pools and match radar.", icon: "trophy" },
      { href: "/", label: "Game Hub", description: "Esports, meta picks and what's surging today.", icon: "sports_esports" },
    ],
  },
];

/** Whether a path belongs to a link ("/orders/LT-123" belongs to "/orders"; "/" only to itself). */
export const ownsPath = (href: string, path: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));
