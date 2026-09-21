import type { Tone } from "../mobile.types";

/** Text colour per mobile tone (literal classes so Tailwind sees them). */
export const TONE_TEXT: Record<Tone, string> = {
  plain: "text-text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  crimson: "text-primary-container",
  indigo: "text-secondary",
  muted: "text-text-muted",
};

/** 4.9 → four full stars and a half. */
export function starGlyphs(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.25;
  return [...Array.from({ length: full }, () => "star" as const), ...(half ? (["star_half"] as const) : [])];
}
