import "server-only";
import type { HubMobileData } from "../mobile.types";
import type { HubData } from "../types";
import { hubMobile } from "./hub-mobile.mock";
import { incentive, loadouts, newThreads, patchDelta, scrapedMarkets, threads } from "./intel.mock";
import { metaCards } from "./meta-cards.mock";
import { games, pulse, spotlights } from "./stage.mock";

/** Game hub snapshot. Mock today; swap for the intel API without touching the UI. */
export async function getHub(): Promise<HubData> {
  return { pulse, games, spotlights, metaCards, patchDelta, scrapedMarkets, loadouts, threads, newThreads, incentive };
}

/** Mobile hub: live arena per tournament, battles, surge index and meta picks. */
export async function getHubMobile(): Promise<HubMobileData> {
  return hubMobile;
}
