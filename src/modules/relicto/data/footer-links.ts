import type { IconName } from "@/components/ui/icon";

export type FooterColumn = {
  title: string;
  icon: IconName;
  tone: string;
  links: { label: string; href: string }[];
};

/**
 * The site-wide footer directory. Every entry is a live route — account pages
 * send guests through sign-in and back. Add a link here only once its page ships.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Marketplace",
    icon: "storefront",
    tone: "text-primary",
    links: [
      { label: "All listings", href: "/marketplace" },
      { label: "CS2 skins", href: "/marketplace?game=cs2" },
      { label: "Dota 2 items", href: "/marketplace?game=dota2" },
      { label: "Newest listings", href: "/marketplace?sort=recent" },
      { label: "Sell your items", href: "/sell" },
    ],
  },
  {
    title: "Explore",
    icon: "sports_esports",
    tone: "text-status-upcoming",
    links: [
      { label: "Game hub", href: "/" },
      { label: "Item wiki", href: "/wiki" },
      { label: "Community", href: "/community" },
      { label: "Tournaments", href: "/tournaments" },
    ],
  },
  {
    title: "Your account",
    icon: "person",
    tone: "text-tertiary",
    links: [
      { label: "Trader profile", href: "/profile" },
      { label: "Orders & escrow", href: "/orders" },
      { label: "Wallet", href: "/wallet" },
      { label: "Price alerts", href: "/alerts" },
      { label: "Price tracker", href: "/tracker" },
    ],
  },
];
