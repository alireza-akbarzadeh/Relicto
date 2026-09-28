import type { SeriesPoint } from "@/modules/tracker/types";
import { unit } from "./tracker.venues";

const DAY = 86_400_000;

/**
 * Test-mode daily history for an item the market feed hasn't observed yet: a
 * random walk that ends exactly at today's simulated quote, so the chart, the
 * ticker and the spreads agree. Deterministic per (item, day) — every render
 * draws the same past. Never used in production.
 */
export function simulatedHistory(slug: string, todayUsd: number, now: number, days = 365): SeriesPoint[] {
  const today = Math.floor(now / DAY) * DAY;
  const points: SeriesPoint[] = [{ at: today, price: todayUsd }];
  let price = todayUsd;
  for (let back = 1; back < days; back++) {
    const at = today - back * DAY;
    // ±2.5% daily moves with a faint upward drift, walked backwards from today.
    const move = 0.05 * (unit(`${slug}:day:${at}`) - 0.5) + 0.0008;
    price = Math.max(0.03, price / (1 + move));
    points.push({ at, price: Math.round(price * 100) / 100 });
  }
  return points.reverse();
}
