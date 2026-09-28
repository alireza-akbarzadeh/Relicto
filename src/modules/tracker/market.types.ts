import type { PriceAlert } from "@/modules/alerts/types";
import type { TRACKER_MARKETS } from "./lib/search-params";

export type TrackerMarket = (typeof TRACKER_MARKETS)[number];

/**
 * A price from outside Relicto. `snapshot` is the last recorded observation
 * (Skinport daily feed, Steam scrape); `sim` is test-mode drift around that
 * anchor, because no venue streams to us yet. Null when neither exists.
 */
export type VenueQuote = { usd: number | null; source: "snapshot" | "sim" | "none" };

/** One item's market, as every live panel reads it. Relicto's own figures are always real. */
export type MarketQuote = {
  slug: string;
  name: string;
  detail: string;
  game: string;
  /** Cheapest active listing. */
  floorUsd: number;
  listings: number;
  bids: number;
  steam: VenueQuote;
  secondary: VenueQuote;
  /** Relicto's floor against the secondary market, in percent. */
  vsMarketPct: number | null;
  /** Secondary minus floor: what a buy here and a sale there grosses. */
  spreadUsd: number | null;
  spreadPct: number | null;
  /** Steam's net payout (after its 15% fee) minus the floor. */
  steamNetUsd: number | null;
  steamYieldUsd: number | null;
};

export type MarketTelemetry = {
  items: number;
  listings: number;
  bids: number;
  /** Every active listing at its asking price. */
  listedUsd: number;
  sales24h: number;
  sales24hUsd: number;
  /** Last daily market-feed observation (ISO), if any. */
  feedAt: string | null;
  /** Items whose recorded venue price is >3× off the floor — a wrong-copy match, left out of the spreads. */
  feedMismatches: number;
  /** Venue quotes are drifting in test mode. */
  simulated: boolean;
};

/** Everything the tracker's market panels show, as the stream pushes it. */
export type MarketSnapshot = {
  market: TrackerMarket;
  /** Server time of this snapshot (ISO) — the client measures latency against it. */
  at: string;
  telemetry: MarketTelemetry;
  ticker: MarketQuote[];
  /** The focused item's quote, whatever the market filter; null when it has no live copy. */
  focus: MarketQuote | null;
  spreads: MarketQuote[];
  alerts: PriceAlert[];
};
