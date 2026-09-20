import type { ListingBadge, Tone } from "../types";

/** Text colour per tone. */
export const TONE_TEXT: Record<Tone, string> = {
  crimson: "text-primary",
  amber: "text-tertiary-fixed-dim",
  indigo: "text-secondary",
  cyan: "text-status-upcoming",
  white: "text-text-primary",
  muted: "text-text-muted",
  live: "text-status-live",
};

/** Filled progress track. */
export const TONE_BAR: Record<Tone, string> = {
  crimson: "bg-primary",
  amber: "bg-tertiary",
  indigo: "bg-secondary",
  cyan: "bg-status-upcoming",
  white: "bg-text-primary",
  muted: "bg-text-muted",
  live: "bg-status-live",
};

/** Ambient blur behind a stat card. */
export const TONE_GLOW_SOFT: Record<Tone, string> = {
  crimson: "bg-primary/10",
  amber: "bg-tertiary/10",
  indigo: "bg-secondary/10",
  cyan: "bg-status-upcoming/10",
  white: "bg-text-primary/10",
  muted: "bg-text-muted/10",
  live: "bg-status-live/10",
};

/** Ambient blur behind a showcase card. */
export const TONE_GLOW: Record<Tone, string> = {
  crimson: "bg-primary/15",
  amber: "bg-tertiary/15",
  indigo: "bg-secondary/15",
  cyan: "bg-status-upcoming/15",
  white: "bg-text-primary/15",
  muted: "bg-text-muted/15",
  live: "bg-status-live/15",
};

/** Item name hover colour. */
export const TONE_HOVER_TEXT: Record<Tone, string> = {
  crimson: "group-hover:text-primary",
  amber: "group-hover:text-tertiary-fixed-dim",
  indigo: "group-hover:text-secondary",
  cyan: "group-hover:text-status-upcoming",
  white: "group-hover:text-text-primary",
  muted: "group-hover:text-text-muted",
  live: "group-hover:text-status-live",
};

/** Coloured drop shadow under a showcase render. */
export const TONE_DROP_SHADOW: Record<Tone, string> = {
  crimson: "drop-shadow-[0_8px_16px_rgba(244,63,94,0.25)]",
  amber: "drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)]",
  indigo: "drop-shadow-[0_8px_16px_rgba(99,102,241,0.25)]",
  cyan: "drop-shadow-[0_8px_16px_rgba(6,182,212,0.25)]",
  white: "drop-shadow-[0_8px_16px_rgba(248,250,252,0.25)]",
  muted: "drop-shadow-[0_8px_16px_rgba(100,116,139,0.25)]",
  live: "drop-shadow-[0_8px_16px_rgba(239,68,68,0.25)]",
};

/** Listing tag colours. */
export const LISTING_BADGE: Record<ListingBadge, string> = {
  indigo: "bg-secondary-container text-on-secondary-container",
  crimson: "bg-surface-container text-primary",
  amber: "bg-tertiary-container text-on-tertiary-container",
};
