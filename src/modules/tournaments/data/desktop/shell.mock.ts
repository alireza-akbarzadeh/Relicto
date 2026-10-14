import type { DesktopShell } from "../../shell.types";

export const desktopShell: DesktopShell = {
  brand: { name: "RELICTO", accent: "ARENA", tagline: "ESPORTS PLATFORM" },
  gamePills: [
    { game: "dota2", label: "DOTA 2" },
    { game: "cs2", label: "CS2" },
  ],
  nav: [
    { id: "tournaments", label: "Tournaments", href: "/tournaments" },
    { id: "marketplace", label: "Marketplace", href: "/marketplace" },
    { id: "live-matches", label: "Live Matches", href: "#live-matches" },
    { id: "community", label: "Community", href: "/community" },
  ],
  activeNav: "tournaments",
  searchPlaceholder: "Search bracket, pro, team...",
  user: {
    handle: "V0RT3X_PRO",
    rank: "DIVINE V",
    status: "STEAM SYNCED",
    avatar: "/images/arena/avatar.png",
  },
};
