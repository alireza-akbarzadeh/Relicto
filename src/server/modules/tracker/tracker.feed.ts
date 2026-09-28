import "server-only";

import type { MarketSnapshot, TrackerMarket } from "@/modules/tracker/market.types";
import { alertService } from "../alerts/alerts.service";
import { watchlistService } from "../watchlist/watchlist.service";
import { findMarketRows } from "./tracker.market";
import { toMarketSnapshot } from "./tracker.snapshot";
import { simulateVenues } from "./tracker.venues";

/** What a market frame is derived from: the catalog's live rows plus this trader's watchlist and alerts. */
export async function loadMarketState(userId: string) {
  const [data, watched, alerts] = await Promise.all([findMarketRows(), watchlistService.slugs(userId), alertService.list(userId)]);
  return { data, watched, alerts };
}

export type MarketState = Awaited<ReturnType<typeof loadMarketState>>;

export function frame(state: MarketState, market: TrackerMarket, focus: string | null, now = Date.now()): MarketSnapshot {
  return toMarketSnapshot({ ...state, market, focus, now, simulate: simulateVenues() });
}

/** The first frame, server-rendered so the page never waits for the stream. */
export async function marketSnapshot(userId: string, market: TrackerMarket, focus: string | null): Promise<MarketSnapshot> {
  return frame(await loadMarketState(userId), market, focus);
}
