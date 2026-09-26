import "server-only";

import type { SearchGame, SearchResults } from "@/modules/search/types";
import {
  toSearchItem,
  toSearchTournament,
  toSearchTrader,
} from "./search.presenter";
import * as entities from "./search.entities";
import * as repo from "./search.repository";
import type { SearchInput } from "./search.schema";

/** Traders and tournaments only answer a real query; two letters is the least that means anything. */
const MIN_ENTITY_QUERY = 2;

export const searchService = {
  /**
   * The command palette's one call: items with a live copy (cheapest copy,
   * reference price), matching traders and tournaments, and per-game counts
   * for the pills. An empty query returns what's moving most.
   */
  async search(input: SearchInput): Promise<SearchResults> {
    const started = performance.now();
    const named = input.q.length >= MIN_ENTITY_QUERY;

    const [matches, counts, traders, events] = await Promise.all([
      repo.findItems(input),
      repo.countByGame(input),
      named ? entities.findTraders(input.q) : [],
      named ? entities.findTournaments(input) : [],
    ]);

    const ids = matches.map((item) => item.id);
    const [copies, quotes] = await Promise.all([
      repo.findCheapestCopies(input, ids),
      repo.findMarketQuotes(ids),
    ]);
    const copyByItem = new Map(copies.map((copy) => [copy.itemId, copy]));
    const quoteByItem = new Map(
      quotes.map((quote) => [quote.itemId, quote.priceCents]),
    );

    const byGame = Object.fromEntries(
      counts.map((row) => [row.gameId, row.matches]),
    ) as Partial<Record<SearchGame, number>>;
    const total = counts.reduce((sum, row) => sum + row.matches, 0);

    return {
      query: input.q,
      items: matches.flatMap((item) => {
        const copy = copyByItem.get(item.id);
        return copy ? [toSearchItem(item, copy, quoteByItem.get(item.id))] : [];
      }),
      traders: traders.map(toSearchTrader),
      tournaments: events.map(toSearchTournament),
      counts: {
        all: total,
        dota2: byGame.dota2 ?? 0,
        cs2: byGame.cs2 ?? 0,
        tf2: byGame.tf2 ?? 0,
      },
      tookMs: Math.round(performance.now() - started),
    };
  },
};
