import "server-only";
import type { HubData } from "../types";
import { incentive, loadouts, newThreads, patchDelta, scrapedMarkets, threads } from "./intel.mock";
import { metaCards } from "./meta-cards.mock";
import { games, pulse, spotlights } from "./stage.mock";

/** Game hub snapshot. Mock today; swap for the intel API without touching the UI. */
export async function getHub(): Promise<HubData> {
  return { pulse, games, spotlights, metaCards, patchDelta, scrapedMarkets, loadouts, threads, newThreads, incentive };
}
