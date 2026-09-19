import type { GameId } from "../types";

type GameTheme = {
  /** Active state of the hero game switcher tab. */
  tabActive: string;
  kicker: string;
  progress: string;
  primaryAction: string;
  status: { badge: string; dot: string };
};

/** Per-game styling of the hero showcase, as in the Stitch switchGame() states. */
export const GAME_THEME: Record<GameId, GameTheme> = {
  dota2: {
    tabActive: "bg-primary-container text-on-primary shadow-[0_0_16px_rgba(244,63,94,0.35)]",
    kicker: "text-primary-container",
    progress: "from-primary-container to-tertiary",
    primaryAction:
      "bg-primary-container text-on-primary hover:shadow-[0_0_24px_rgba(244,63,94,0.45)]",
    status: { badge: "bg-status-live/20 text-error", dot: "bg-status-live" },
  },
  cs2: {
    tabActive:
      "bg-tertiary-container text-on-tertiary-container shadow-[0_0_16px_rgba(245,158,11,0.35)]",
    kicker: "text-tertiary",
    progress: "from-tertiary to-status-upcoming",
    primaryAction:
      "bg-tertiary-container text-on-tertiary-container hover:shadow-[0_0_24px_rgba(245,158,11,0.45)]",
    status: { badge: "bg-status-upcoming/20 text-status-upcoming", dot: "bg-status-upcoming" },
  },
};

export const GAME_DOT: Record<GameId, string> = {
  dota2: "bg-primary-container",
  cs2: "bg-tertiary-container",
};
