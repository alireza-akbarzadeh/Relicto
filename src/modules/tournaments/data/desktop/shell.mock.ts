import type { DesktopShell } from "../../shell.types";

export const desktopShell: DesktopShell = {
  brand: { name: "APEX", accent: "AEGIS", tagline: "CHAMPIONSHIP HUD" },
  gamePills: [
    { game: "dota2", label: "DOTA 2" },
    { game: "cs2", label: "CS2" },
  ],
  nav: [
    { id: "tournaments", label: "Tournaments", href: "/tournaments" },
    { id: "match-hub", label: "Match Hub", href: "#" },
    { id: "leaderboards", label: "Leaderboards", href: "#" },
    { id: "live-streams", label: "Live Streams", href: "#" },
    { id: "news", label: "News", href: "#" },
  ],
  activeNav: "tournaments",
  searchPlaceholder: "Search bracket, pro, team...",
  user: {
    handle: "V0RT3X_PRO",
    rank: "DIVINE V",
    status: "STEAM SYNCED",
    avatar: "/images/arena/avatar.png",
  },
  footer: {
    description:
      "Premier competitive gaming architecture and tournament operations engine for Valve Dota 2 and Counter-Strike 2 circuits.",
    links: [
      { id: "championships", label: "Championships", href: "#" },
      { id: "pro-circuit", label: "Pro Circuit", href: "#" },
      { id: "rulebooks", label: "Rulebooks", href: "#" },
      { id: "steam", label: "Steam Integration", href: "#" },
    ],
    copyright:
      "© 2025 APEX AEGIS ENTERTAINMENT LLC. VALVE, DOTA 2, AND CS2 ARE TRADEMARKS OF VALVE CORPORATION.",
  },
};
