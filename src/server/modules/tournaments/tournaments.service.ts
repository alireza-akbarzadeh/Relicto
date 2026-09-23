import "server-only";

import type { ArenaCard, Broadcast, FeedMatch, HeroEvent } from "@/modules/tournaments/types";
import { toArenaCard, toBroadcast, toFeedMatch, toHeroEvent } from "./tournaments.presenter";
import * as repository from "./tournaments.repository";

export type ArenaLive = {
  heroEvents: HeroEvent[];
  cards: ArenaCard[];
  openEvents: number;
  broadcast: Broadcast | null;
  feeds: FeedMatch[];
};

const present = <T,>(values: (T | null)[]) => values.filter((value): value is T => value !== null);

export const tournamentService = {
  /** The Arena hub's live blocks, or null before anything is seeded. */
  async arena(now = new Date()): Promise<ArenaLive | null> {
    const [events, games] = await Promise.all([repository.findOpenTournaments(), repository.findActiveMatches()]);
    if (events.length === 0) return null;

    const featured = games.find((row) => row.match.featured);

    return {
      heroEvents: present(events.filter((row) => row.featured).map((row) => toHeroEvent(row, now))),
      cards: present(events.filter((row) => !row.featured).map(toArenaCard)),
      openEvents: events.length,
      broadcast: featured ? toBroadcast(featured) : null,
      feeds: games.filter((row) => !row.match.featured).map(toFeedMatch),
    };
  },
};
