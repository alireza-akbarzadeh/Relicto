import type { ChartRange, PricePoint } from "../types";

const DAY = 86_400_000;

/** How far back each range pill reaches. `ALL` keeps the whole series. */
const WINDOW_MS: Record<ChartRange, number | null> = {
  "24H": DAY,
  "7D": 7 * DAY,
  "30D": 30 * DAY,
  "90D": 90 * DAY,
  "1Y": 365 * DAY,
  ALL: null,
};

/**
 * The slice a range pill selects, measured back from the newest observation
 * rather than "now", so a series that ends yesterday still renders.
 *
 * Never returns fewer than two points — a one-point chart draws nothing, and a
 * short history shouldn't blank the panel just because the range is narrow.
 */
export function withinRange(points: PricePoint[], range: ChartRange): PricePoint[] {
  const window = WINDOW_MS[range];
  if (!window || points.length < 2) return points;

  const newest = Math.max(...points.map((point) => point.at));
  const slice = points.filter((point) => newest - point.at <= window);
  return slice.length >= 2 ? slice : points.slice(-2);
}
