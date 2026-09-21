import type { IconName } from "@/components/ui/icon";

export type MobileTab = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  /** Unread-activity dot in the corner of the tab. */
  dot?: boolean;
};

/** Bottom tab bars, one per mobile header family, in the order each Stitch screen shows them. */
export const MOBILE_TABS = {
  /** Marketplace, price tracker. */
  market: [
    { id: "market", label: "Market", href: "/marketplace", icon: "storefront" },
    { id: "tracker", label: "Tracker", href: "/tracker", icon: "monitoring", dot: true },
    { id: "vault", label: "Vault", href: "/sell", icon: "backpack" },
    { id: "intel", label: "Intel", href: "/", icon: "swords" },
    { id: "profile", label: "Profile", href: "/profile", icon: "account_circle" },
  ],
  /** Game hub, sell studio, wallet, price alerts. */
  linked: [
    { id: "market", label: "Market", href: "/marketplace", icon: "storefront" },
    { id: "esports", label: "Esports", href: "/", icon: "military_tech" },
    { id: "inventory", label: "Inventory", href: "/sell", icon: "inventory_2" },
    { id: "wallet", label: "Wallet", href: "/wallet", icon: "account_balance_wallet" },
    { id: "alerts", label: "Alerts", href: "/alerts", icon: "notifications_active" },
  ],
  /** Order tracking, trader profile. */
  intel: [
    { id: "market", label: "Market", href: "/marketplace", icon: "storefront" },
    { id: "tracker", label: "Tracker", href: "/orders", icon: "radar" },
    { id: "vault", label: "Vault", href: "/wallet", icon: "shield" },
    { id: "intel", label: "Intel", href: "/", icon: "analytics" },
    { id: "profile", label: "Profile", href: "/profile", icon: "person" },
  ],
} satisfies Record<string, MobileTab[]>;

export type MobileTabFamily = keyof typeof MOBILE_TABS;
