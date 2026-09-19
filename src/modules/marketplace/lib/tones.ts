import type { IconName } from "@/components/ui/icon";
import type { Trend } from "@/lib/format";
import type { Accent, BlobTone, Listing, ShadowTone } from "../types";

/** Literal class maps (Tailwind needs to see full class names). */

export const ACCENT_TEXT: Record<Accent, string> = {
  crimson: "text-primary-container",
  pink: "text-primary",
  amber: "text-tertiary",
  gold: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
  muted: "text-text-muted",
  neutral: "text-text-secondary",
};

export const RARITY_BADGE: Record<Listing["badge"]["style"], string> = {
  arcana: "bg-primary-container text-on-primary-container",
  immortal: "bg-tertiary-container text-on-tertiary-container",
  covert: "bg-primary-container text-on-primary-container",
  melee: "bg-tertiary text-on-tertiary",
  gloves: "bg-primary text-on-primary",
};

export const CARD_BLOB: Record<BlobTone, string> = {
  primary: "bg-primary/10 group-hover:bg-primary/20",
  secondary: "bg-secondary/10 group-hover:bg-secondary/20",
  amber: "bg-[rgb(245_158_11/0.1)] group-hover:bg-[rgb(245_158_11/0.2)]",
  indigo: "bg-[rgb(99_102_241/0.1)] group-hover:bg-[rgb(99_102_241/0.2)]",
};

export const ART_SHADOW: Record<ShadowTone, string> = {
  "crimson-30": "drop-shadow-[0_10px_15px_rgba(244,63,94,0.3)]",
  "crimson-20": "drop-shadow-[0_10px_15px_rgba(244,63,94,0.2)]",
  "amber-20": "drop-shadow-[0_10px_15px_rgba(245,158,11,0.2)]",
  "amber-25": "drop-shadow-[0_10px_15px_rgba(245,158,11,0.25)]",
  "cyan-20": "drop-shadow-[0_10px_15px_rgba(6,182,212,0.2)]",
  "indigo-30": "drop-shadow-[0_10px_15px_rgba(99,102,241,0.3)]",
  "indigo-25": "drop-shadow-[0_10px_15px_rgba(99,102,241,0.25)]",
};

export const TREND_STYLE: Record<Trend, { text: string; icon: IconName }> = {
  up: { text: "text-status-upcoming", icon: "trending_up" },
  down: { text: "text-error", icon: "trending_down" },
  flat: { text: "text-text-muted", icon: "trending_flat" },
};

export const MOVER_BADGE: Record<string, string> = {
  pink: "bg-primary-container/20 text-primary",
  amber: "bg-tertiary/20 text-tertiary",
  neutral: "bg-surface-container-high text-text-secondary",
};

export const MOVER_BLOB: Record<string, string> = {
  pink: "bg-primary/5 group-hover:bg-primary/10",
  amber: "bg-tertiary/5 group-hover:bg-tertiary/10",
  cyan: "bg-status-upcoming/5 group-hover:bg-status-upcoming/10",
  indigo: "bg-secondary/5 group-hover:bg-secondary/10",
};

export const MOVER_HOVER: Record<string, string> = {
  pink: "group-hover:text-primary",
  amber: "group-hover:text-tertiary",
};
