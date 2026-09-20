import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const TRACKER_MARKETS = ["ALL", "CS2", "DOTA 2", "LIQUID"] as const;
export const TRACKER_RANGES = ["15M", "1H", "4H", "1D", "1W", "ALL"] as const;

/** Arbitrage terminal URL contract: market, chart range and asset search. */
export const trackerSearchParams = {
  market: parseAsStringLiteral(TRACKER_MARKETS).withDefault("CS2"),
  range: parseAsStringLiteral(TRACKER_RANGES).withDefault("4H"),
  q: parseAsString.withDefault(""),
};

export const loadTrackerSearchParams = createLoader(trackerSearchParams);
