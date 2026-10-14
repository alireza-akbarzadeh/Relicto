import "server-only";
import { connection } from "next/server";
import { rethrowNextSignals } from "@/lib/next-signals";
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

import { getSession, getUserId } from "@/modules/relicto/data/get-session";

/**
 * The Arena hub. Tournaments, matches and the broadcast come from Postgres; the
 * page chrome, filters, platform marketing stats and infrastructure copy stay
 * authored. Falls back to the mocks on a database nobody has seeded.
 */
export async function getArenaDesktop() {
  // Live scores and a registration countdown: render per request, never at build.
  await connection();
  let live = null;
  try {
    live = await tournamentService.arena();
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getArenaDesktop] Fallback to mock:", err);
  }

  const [session, userId] = await Promise.all([getSession(), getUserId()]);
  const pickMap = new Map<string, string>();
  if (userId) {
    try {
      const preds = await tournamentService.userPredictions(userId);
      for (const p of preds) {
        if (p.teamId) pickMap.set(p.matchId, p.teamId);
      }
    } catch {
      // fallback to empty predictions gracefully
    }
  }

  const rawFeeds = live?.feeds ?? feedMatches;
  const feeds = rawFeeds.map((m) => ({
    ...m,
    userPick: pickMap.get(m.id),
  }));

  const shellUser = session?.user
    ? {
        handle: session.user.handle,
        rank: `${session.user.role} Lv.${session.user.level}`,
        status: "Verified Broker • 99.8%",
        avatar: session.user.avatar || "/avatars/trader-1.png",
      }
    : desktopShell.user;

  const unreadNotifications = (session?.notifications?.filter((n) => n.unread).length ?? 0) > 0;

  return {
    shell: { ...desktopShell, user: shellUser },
    unreadNotifications,
    hero: { events: live?.heroEvents ?? heroEvents, telemetry: heroTelemetry, stats: platformStats },
    arenas: {
      section: live ? { ...arenaSection, openEvents: live.openEvents } : arenaSection,
      filters: circuitFilters,
      chips: filterChips,
      cards: live?.cards ?? arenaCards,
    },
    live: { broadcast: live?.broadcast ?? broadcast, feeds },
    infrastructure,
  };
}

/**
 * Mobile arena: the same tournaments and live matches as desktop, as bracket
 * cards and the radar; championship banner, quick match and chrome stay authored.
 */
export async function getArenaMobile() {
  await connection();
  let live = null;
  try {
    live = await tournamentService.arenaMobile();
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getArenaMobile] Fallback to mock:", err);
  }

  const userId = await getUserId();
  const pickMap = new Map<string, string>();
  if (userId) {
    try {
      const preds = await tournamentService.userPredictions(userId);
      for (const p of preds) {
        if (p.teamId) pickMap.set(p.matchId, p.teamId);
      }
    } catch {
      // fallback gracefully
    }
  }

  const rawRadar = live?.radar ?? radarMatches;
  const radar = rawRadar.map((m) => ({
    ...m,
    userPick: pickMap.get(m.id),
  }));

  return {
    shell: mobileShell,
    gameTabs: mobileGameTabs,
    championship,
    search: { placeholder: searchPlaceholder, chips: quickChips },
    brackets: {
      section: live ? { ...bracketsSection, meta: `${live.openEvents} Live Events` } : bracketsSection,
      cards: live?.brackets ?? bracketCards,
      quickMatch,
    },
    radar: { section: radarSection, matches: radar },
    infrastructure: { section: infrastructureSection, items: bentoItems, server: serverStatus },
  };
}

export type ArenaDesktopData = Awaited<ReturnType<typeof getArenaDesktop>>;
export type ArenaMobileData = Awaited<ReturnType<typeof getArenaMobile>>;
