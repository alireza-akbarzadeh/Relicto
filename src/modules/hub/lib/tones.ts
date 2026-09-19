import type { Accent, SignalTone, SpotlightBadge, Tone } from "../types";

/** Text colour per tone. */
export const TONE_TEXT: Record<Tone, string> = {
  crimson: "text-primary",
  cyan: "text-status-upcoming",
  amber: "text-tertiary",
  indigo: "text-secondary",
  white: "text-white",
  muted: "text-text-muted",
};

/** Solid dot per signal tone. */
export const TONE_DOT: Record<SignalTone, string> = {
  crimson: "bg-primary",
  cyan: "bg-status-upcoming",
  amber: "bg-tertiary",
};

/** Tinted status pill (table "Intel Status"). */
export const STATUS_PILL: Record<SignalTone, string> = {
  crimson: "border-primary/30 bg-primary/20 text-[#fb7185]",
  cyan: "border-status-upcoming/30 bg-status-upcoming/20 text-[#22d3ee]",
  amber: "border-tertiary/30 bg-tertiary/20 text-[#fbbf24]",
};

/** Outlined label: 30% border in the text colour. */
export const OUTLINE_PILL: Record<SignalTone, string> = {
  crimson: "border-primary/30 text-primary",
  cyan: "border-status-upcoming/30 text-status-upcoming",
  amber: "border-tertiary/30 text-tertiary",
};

/** Floating chip over card media: 40% border. */
export const SIGNAL_CHIP: Record<SignalTone, string> = {
  crimson: "border-primary/40 text-primary",
  cyan: "border-status-upcoming/40 text-status-upcoming",
  amber: "border-tertiary/40 text-tertiary",
};

/** Spotlight hero badges. */
export const SPOTLIGHT_BADGE: Record<SpotlightBadge["variant"], string> = {
  solid: "bg-primary text-white font-bold tracking-wider shadow-xs",
  amber: "border border-surface-bright bg-surface-container-high text-tertiary font-semibold",
  cyan: "border border-status-upcoming/30 bg-surface-card text-status-upcoming font-semibold",
};

/** Meta card accent: tier badge, hover glow, CTA hover. */
export const ACCENT: Record<Accent, { tier: string; card: string; cta: string }> = {
  crimson: {
    tier: "bg-primary text-white",
    card: "hover:border-primary/50 hover:shadow-[0_0_24px_rgba(244,63,94,0.25)]",
    cta: "hover:bg-primary",
  },
  indigo: {
    tier: "bg-[#4f46e5] text-white",
    card: "hover:border-[#6366f1]/50 hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]",
    cta: "hover:bg-[#4f46e5]",
  },
  amber: {
    tier: "bg-tertiary-container text-black",
    card: "hover:border-tertiary/50 hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]",
    cta: "hover:bg-[#d97706]",
  },
};
