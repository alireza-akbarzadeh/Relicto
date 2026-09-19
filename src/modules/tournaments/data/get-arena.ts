import "server-only";

import { arenaCards, arenaSection, circuitFilters, filterChips } from "./desktop/arenas.mock";
import { heroEvents, heroTelemetry, platformStats } from "./desktop/hero.mock";
import { infrastructure } from "./desktop/infrastructure.mock";
import { broadcast, feedMatches } from "./desktop/live.mock";
import { desktopShell } from "./desktop/shell.mock";
import { bracketCards, bracketsSection, quickMatch } from "./mobile/brackets.mock";
import {
  bentoItems,
  championship,
  infrastructureSection,
  mobileGameTabs,
  mobileShell,
  quickChips,
  radarMatches,
  radarSection,
  searchPlaceholder,
  serverStatus,
} from "./mobile/hub.mock";

/**
 * Page data access for the Arena hub. Returns mock data today; swap each block
 * for a query with the same shape when the backend lands.
 */
export async function getArenaDesktop() {
  return {
    shell: desktopShell,
    hero: { events: heroEvents, telemetry: heroTelemetry, stats: platformStats },
    arenas: { section: arenaSection, filters: circuitFilters, chips: filterChips, cards: arenaCards },
    live: { broadcast, feeds: feedMatches },
    infrastructure,
  };
}

export async function getArenaMobile() {
  return {
    shell: mobileShell,
    gameTabs: mobileGameTabs,
    championship,
    search: { placeholder: searchPlaceholder, chips: quickChips },
    brackets: { section: bracketsSection, cards: bracketCards, quickMatch },
    radar: { section: radarSection, matches: radarMatches },
    infrastructure: { section: infrastructureSection, items: bentoItems, server: serverStatus },
  };
}

export type ArenaDesktopData = Awaited<ReturnType<typeof getArenaDesktop>>;
export type ArenaMobileData = Awaited<ReturnType<typeof getArenaMobile>>;
