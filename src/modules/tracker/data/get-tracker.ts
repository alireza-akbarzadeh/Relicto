import "server-only";
import { rethrowNextSignals } from "@/lib/next-signals";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { marketSnapshot } from "@/server/modules/tracker/tracker.feed";
import { trackerService } from "@/server/modules/tracker/tracker.service";
import type { MarketSnapshot, TrackerMarket } from "../market.types";
import type { TrackerData } from "../types";
import { tracker } from "./tracker.mock";
import { trackerMobile } from "./tracker-mobile.mock";

/**
 * Arbitrage terminal for the signed-in trader, from Postgres. Falls back to the
 * sample board until the account follows anything.
 */
export async function getTracker(asset = ""): Promise<TrackerData> {
  const userId = await requireUserId();
  try {
    const terminal = await trackerService.terminal(userId, asset || undefined);
    // Without a board, the sample board shows — but the focused item's book and chart are always real.
    return terminal.assets.length > 0 ? terminal : { ...tracker, live: terminal.live };
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getTracker] Fallback to mock:", err);
    return tracker;
  }
}

/** The market panels' first frame; the market stream takes over in the browser. */
export async function getTrackerMarket(market: TrackerMarket, focus: string | null): Promise<MarketSnapshot> {
  return marketSnapshot(await requireUserId(), market, focus);
}

/** Mobile terminal: the same board, depth, spreads and history as desktop, with the mobile chrome. */
export async function getTrackerMobile() {
  const userId = await requireUserId();
  try {
    return (await trackerService.terminalMobile(userId, trackerMobile)) ?? trackerMobile;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getTrackerMobile] Fallback to mock:", err);
    return trackerMobile;
  }
}
