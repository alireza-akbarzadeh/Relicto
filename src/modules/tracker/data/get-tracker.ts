import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { trackerService } from "@/server/modules/tracker/tracker.service";
import type { TrackerData } from "../types";
import { tracker } from "./tracker.mock";
import { trackerMobile } from "./tracker-mobile.mock";

/**
 * Arbitrage terminal for the signed-in trader, from Postgres. Falls back to the
 * sample board until the account follows anything.
 */
export async function getTracker(asset = ""): Promise<TrackerData> {
  const terminal = await trackerService.terminal(await requireUserId(), asset || undefined);
  // Without a board, the sample board shows — but the focused item's book and chart are always real.
  return terminal.assets.length > 0 ? terminal : { ...tracker, live: terminal.live };
}

/** Mobile terminal: the same board, depth, spreads and history as desktop, with the mobile chrome. */
export async function getTrackerMobile() {
  return (await trackerService.terminalMobile(await requireUserId(), trackerMobile)) ?? trackerMobile;
}
