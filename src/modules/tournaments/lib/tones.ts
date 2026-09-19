import type { Accent, StatusBadge, Tone } from "../types";

/**
 * Class maps that translate semantic tones into design tokens. Kept as full
 * literal class strings so Tailwind can see them at build time.
 */
export const TEXT_TONE: Record<Tone, string> = {
  crimson: "text-primary-container",
  primary: "text-primary",
  strong: "text-text-primary",
  amber: "text-tertiary",
  indigo: "text-secondary",
  cyan: "text-status-upcoming",
  live: "text-status-live",
  muted: "text-text-muted",
  secondary: "text-text-secondary",
};

export const DOT_TONE: Record<Tone, string> = {
  crimson: "bg-primary-container",
  primary: "bg-primary",
  strong: "bg-text-primary",
  amber: "bg-tertiary",
  indigo: "bg-secondary",
  cyan: "bg-status-upcoming",
  live: "bg-status-live",
  muted: "bg-text-muted",
  secondary: "bg-text-secondary",
};

/** Card accents: label color, hover title color, hover glow. */
export const ACCENT_CARD: Record<Accent, { label: string; hoverTitle: string; hoverGlow: string }> = {
  crimson: {
    label: "text-primary",
    hoverTitle: "group-hover:text-primary",
    hoverGlow: "hover:shadow-[0_0_24px_rgba(244,63,94,0.25)]",
  },
  amber: {
    label: "text-tertiary",
    hoverTitle: "group-hover:text-tertiary",
    hoverGlow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]",
  },
  indigo: {
    label: "text-secondary",
    hoverTitle: "group-hover:text-secondary",
    hoverGlow: "hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]",
  },
};

export const STATUS_BADGE: Record<StatusBadge["kind"], { badge: string; dot: string }> = {
  live: { badge: "bg-status-live text-text-primary", dot: "bg-text-primary" },
  registering: { badge: "bg-status-upcoming/30 text-status-upcoming", dot: "bg-status-upcoming" },
  today: { badge: "bg-status-upcoming/30 text-status-upcoming", dot: "bg-status-upcoming" },
  neutral: { badge: "bg-surface-container-high text-text-primary", dot: "bg-text-primary" },
};

export const INDICATOR_ANIMATION = {
  ping: "animate-ping",
  pulse: "animate-pulse",
  dot: "",
} as const;
