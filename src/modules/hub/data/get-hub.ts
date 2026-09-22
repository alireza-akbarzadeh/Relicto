import "server-only";
import { listingService } from "@/server/modules/listings/listings.service";
import type { HubMobileData } from "../mobile.types";
import type { HubData } from "../types";
import { hubMobile } from "./hub-mobile.mock";
import { incentive, loadouts, newThreads, patchDelta, scrapedMarkets, threads } from "./intel.mock";
import { metaCards } from "./meta-cards.mock";
import { games, pulse, spotlights } from "./stage.mock";

/** Items whose live floor the spotlight copy quotes. */
const SPOTLIGHT_FLOORS = { dota: "manifold-paradox", cs2: "butterfly-doppler" } as const;

const money = (usd: number) => `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Game hub snapshot. The editorial meta-intel stays authored; the money on the
 * page (liquidity, spotlight floors) comes from the live catalog so it can't
 * drift from what the marketplace is actually selling.
 */
export async function getHub(): Promise<HubData> {
  const { liquidityUsd, floorsBySlug } = await listingService.marketStats(Object.values(SPOTLIGHT_FLOORS));

  const dotaFloor = floorsBySlug.get(SPOTLIGHT_FLOORS.dota);
  const cs2Floor = floorsBySlug.get(SPOTLIGHT_FLOORS.cs2);

  const live = {
    ...spotlights,
    dota: dotaFloor
      ? {
          ...spotlights.dota,
          primaryCta: { ...spotlights.dota.primaryCta, label: `Inspect Arcana Floor (${money(dotaFloor / 100)})` },
          chart: { ...spotlights.dota.chart, peak: money(dotaFloor / 100) },
        }
      : spotlights.dota,
    cs2: cs2Floor
      ? { ...spotlights.cs2, chart: { ...spotlights.cs2.chart, peak: money(cs2Floor / 100) } }
      : spotlights.cs2,
  };

  return {
    pulse: { ...pulse, liquidityUsd: liquidityUsd > 0 ? liquidityUsd : pulse.liquidityUsd },
    games,
    spotlights: live,
    metaCards,
    patchDelta,
    scrapedMarkets,
    loadouts,
    threads,
    newThreads,
    incentive,
  };
}

/** Mobile hub: live arena per tournament, battles, surge index and meta picks. */
export async function getHubMobile(): Promise<HubMobileData> {
  return hubMobile;
}
