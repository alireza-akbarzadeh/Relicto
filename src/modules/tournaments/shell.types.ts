import type { IconName } from "@/components/ui/icon";
import type { Brand, GameId } from "./types";

export type NavLink = { id: string; label: string; href: string };

export type ArenaUser = {
  handle: string;
  rank: string;
  status: string;
  avatar: string;
};

export type DesktopShell = {
  brand: Brand;
  gamePills: { game: GameId; label: string }[];
  nav: NavLink[];
  activeNav: string;
  searchPlaceholder: string;
  user: ArenaUser;
  footer: {
    description: string;
    links: NavLink[];
    copyright: string;
  };
};

export type MobileTab = { id: string; label: string; icon: IconName; href: string; badge?: boolean };

export type MobileShell = {
  brand: Brand;
  tierBadge: string;
  liveCount: number;
  tabs: MobileTab[];
  activeTab: string;
};
