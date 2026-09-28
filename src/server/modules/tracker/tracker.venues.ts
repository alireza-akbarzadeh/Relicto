import type { VenueQuote } from "@/modules/tracker/market.types";
import type { MarketRow } from "./tracker.market";

/**
 * Outside venues don't stream to Relicto yet: Steam is scraped per listing and
 * Skinport once a day. In test mode the terminal still has to move, so quotes
 * drift around their anchor — the last real observation, or a plausible
 * premium/discount on Relicto's floor when there is none — and are labelled
 * `sim`. In production an unobserved venue is simply absent.
 *
 * The drift is a pure function of (item, time), so every tab and every server
 * instance shows the same quote at the same moment, with no shared state.
 */
export const simulateVenues = () =>
  process.env.TRACKER_SIMULATE_VENUES === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.TRACKER_SIMULATE_VENUES !== "false");

/** How often a simulated quote moves; the stream ticks at this pace. */
export const SIM_STEP_MS = 2_000;

/** Where an unobserved venue is anchored: Steam lists above third-party markets, Skinport a touch below. */
const STEAM_PREMIUM = 1.12;
const SECONDARY_DISCOUNT = 0.97;

/** FNV-1a → [0, 1): stable per string. */
export function unit(seed: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) hash = Math.imul(hash ^ seed.charCodeAt(i), 0x01000193);
  return (hash >>> 0) / 0x1_0000_0000;
}

/** ±1.5% slow swell (period 1.5–4 min, per item) plus ±0.6% step noise. */
function drift(key: string, now: number) {
  const period = 90_000 + unit(`${key}:period`) * 150_000;
  const phase = unit(`${key}:phase`) * Math.PI * 2;
  const step = Math.floor(now / SIM_STEP_MS);
  return 0.015 * Math.sin((now / period) * Math.PI * 2 + phase) + 0.012 * (unit(`${key}:${step}`) - 0.5);
}

function quote(anchorCents: number | null, fallbackCents: number, key: string, now: number, simulate: boolean): VenueQuote {
  if (!simulate) return anchorCents === null ? { usd: null, source: "none" } : { usd: anchorCents / 100, source: "snapshot" };
  const base = anchorCents ?? fallbackCents;
  return { usd: Math.round(base * (1 + drift(key, now))) / 100, source: "sim" };
}

/**
 * A venue price more than 3× off Relicto's floor is almost always a feed
 * match against the wrong copy (another wear, StatTrak, Souvenir), not an
 * arbitrage. It is treated as unobserved, and counted so the mismatch stays visible.
 */
const MISMATCH_RATIO = 3;
export const isMismatch = (anchorCents: number | null, floorCents: number) =>
  anchorCents !== null && (anchorCents > floorCents * MISMATCH_RATIO || anchorCents * MISMATCH_RATIO < floorCents);

type VenueRow = Pick<MarketRow, "slug" | "floorCents" | "steamCents" | "feedCents">;

export function venueQuotes(row: VenueRow, now: number, simulate: boolean) {
  const anchor = (cents: number | null) => (isMismatch(cents, row.floorCents) ? null : cents);
  return {
    steam: quote(anchor(row.steamCents), row.floorCents * STEAM_PREMIUM, `${row.slug}:steam`, now, simulate),
    secondary: quote(anchor(row.feedCents), row.floorCents * SECONDARY_DISCOUNT, `${row.slug}:secondary`, now, simulate),
  };
}
