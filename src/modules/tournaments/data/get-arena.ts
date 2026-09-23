import "server-only";

import { connection } from "next/server";
import { tournamentService } from "@/server/modules/tournaments/tournaments.service";
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
 * The Arena hub. Tournaments, matches and the broadcast come from Postgres; the
 * page chrome, filters, platform marketing stats and infrastructure copy stay
 * authored. Falls back to the mocks on a database nobody has seeded.
 */
export async function getArenaDesktop() {
  // Live scores and a registration countdown: render per request, never at build.
  await connection();
  const live = await tournamentService.arena();

  return {
    shell: desktopShell,
    hero: { events: live?.heroEvents ?? heroEvents, telemetry: heroTelemetry, stats: platformStats },
    arenas: {
      section: live ? { ...arenaSection, openEvents: live.openEvents } : arenaSection,
      filters: circuitFilters,
      chips: filterChips,
      cards: live?.cards ?? arenaCards,
    },
    live: { broadcast: live?.broadcast ?? broadcast, feeds: live?.feeds ?? feedMatches },
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
