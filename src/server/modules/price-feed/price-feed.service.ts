import "server-only";

import { fetchSkinportQuotes } from "@/lib/prices/skinport";
import {
  dailyPointId,
  FEED_GAMES,
  marketNames,
  salePointId,
} from "./price-feed.mapper";
import * as repo from "./price-feed.repository";

type Executor = Parameters<typeof repo.insertSalePoint>[0];

export type FeedRun = {
  game: string;
  quoted: number;
  catalog: number;
  failed?: true;
}[];

export const priceFeedService = {
  /**
   * Records today's lowest Skinport ask for every catalog item Skinport
   * trades, one point per item per day. Runs daily from the cron; the item
   * page's chart is built from these observations and Relicto's own sales.
   */
  async snapshot(now = new Date()): Promise<FeedRun> {
    const run: FeedRun = [];
    for (const game of FEED_GAMES) {
      const [quotes, catalog] = await Promise.all([
        fetchSkinportQuotes(game.appId),
        repo.findCatalog(game.gameId),
      ]);
      if (!quotes) {
        run.push({
          game: game.gameId,
          quoted: 0,
          catalog: catalog.length,
          failed: true,
        });
        continue;
      }

      const rows: repo.PointRow[] = [];
      for (const item of catalog) {
        const quote = marketNames(item, item.wear)
          .map((name) => quotes.get(name))
          .find((q) => q && q.minCents !== null);
        if (!quote?.minCents) continue;
        rows.push({
          id: dailyPointId("skinport", item.id, now),
          itemId: item.id,
          venue: "skinport",
          priceCents: quote.minCents,
          volume: quote.quantity,
          recordedAt: now,
        });
      }

      await repo.upsertPoints(rows);
      run.push({
        game: game.gameId,
        quoted: rows.length,
        catalog: catalog.length,
      });
    }
    return run;
  },

  /** A Relicto trade settled: its price is a real observation for that item. */
  recordSale(
    executor: Executor,
    sale: { orderCode: string; itemId: string; priceCents: number; at: Date },
  ) {
    return repo.insertSalePoint(executor, {
      id: salePointId(sale.orderCode),
      itemId: sale.itemId,
      venue: "relicto",
      priceCents: sale.priceCents,
      volume: 1,
      recordedAt: sale.at,
    });
  },
};
