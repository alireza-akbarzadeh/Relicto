import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const TRACKER_MARKETS = ["ALL", "CS2", "DOTA 2", "LIQUID"] as const;
export const TRACKER_RANGES = ["15M", "1H", "4H", "1D", "1W", "ALL"] as const;
/** The live chart's windows: the market series is one observation a day, so no intraday spans. */
export const TRACKER_SPANS = ["7D", "30D", "90D", "1Y", "ALL"] as const;

/** Arbitrage terminal URL contract: market, chart range and asset search. */
export const trackerSearchParams = {
  market: parseAsStringLiteral(TRACKER_MARKETS).withDefault("CS2"),
  range: parseAsStringLiteral(TRACKER_RANGES).withDefault("4H"),
  q: parseAsString.withDefault(""),
  /** The focused item's slug; its book, chart and stream follow it. Changing it re-renders on the server. */
  asset: parseAsString.withDefault("").withOptions({ shallow: false }),
  span: parseAsStringLiteral(TRACKER_SPANS).withDefault("30D"),
};

export const loadTrackerSearchParams = createLoader(trackerSearchParams);
