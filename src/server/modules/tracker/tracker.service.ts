import "server-only";

import { asc, desc, eq, inArray, min } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, marketSpreads, orderBookLevels, pricePoints, watchlist } from "@/lib/db/schema";
import type { IconName } from "@/components/ui/icon";
import type { OrderLevel, SpreadRow, TrackerAsset, TrackerData, TrackerTone } from "@/modules/tracker/types";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pct = (value: number) => `${value >= 0 ? "+" : ""}${Math.round(value * 10) / 10}%`;

/** The board item whose depth and chart the terminal is focused on. */
const FOCUS_SLUG = "butterfly-doppler";

/** Chart points are normalised to 0–100 so the sparkline scales itself. */
function toChart(points: { priceCents: number }[], buckets = 12): number[] {
  if (points.length === 0) return [];

  const step = Math.max(1, Math.floor(points.length / buckets));
  const sampled = Array.from({ length: buckets }, (_, i) => points[Math.min(i * step, points.length - 1)].priceCents);
  const low = Math.min(...sampled);
  const high = Math.max(...sampled);

  if (high === low) return sampled.map(() => 50);
  return sampled.map((cents) => Math.round(((cents - low) / (high - low)) * 80) + 10);
}

export const trackerService = {
  /** The trader's tracker terminal: board, depth, spreads and chart. */
  async terminal(userId: string): Promise<TrackerData> {
    const board = await db
      .select({ row: watchlist, name: items.name, changePercent: listings.changePercent })
      .from(watchlist)
      .innerJoin(items, eq(watchlist.itemId, items.id))
      .leftJoin(listings, eq(listings.itemId, items.id))
      .where(eq(watchlist.userId, userId))
      .orderBy(asc(watchlist.sortOrder));

    const itemIds = [...new Set(board.map((b) => b.row.itemId))];
    const floors = itemIds.length
      ? await db
          .select({ itemId: listings.itemId, floorCents: min(listings.priceCents) })
          .from(listings)
          .where(inArray(listings.itemId, itemIds))
          .groupBy(listings.itemId)
      : [];
    const floorByItem = new Map(floors.map((f) => [f.itemId, Number(f.floorCents ?? 0)]));

    const [book, spreads, series] = await Promise.all([
      db
        .select({ level: orderBookLevels })
        .from(orderBookLevels)
        .innerJoin(items, eq(orderBookLevels.itemId, items.id))
        .where(eq(items.slug, FOCUS_SLUG))
        .orderBy(desc(orderBookLevels.priceCents)),
      db.select().from(marketSpreads).orderBy(asc(marketSpreads.sortOrder)),
      db
        .select({ priceCents: pricePoints.priceCents })
        .from(pricePoints)
        .innerJoin(items, eq(pricePoints.itemId, items.id))
        .where(eq(items.slug, FOCUS_SLUG))
        .orderBy(asc(pricePoints.recordedAt)),
    ]);

    const assets: TrackerAsset[] = board.map(({ row, name, changePercent }) => ({
      id: row.id,
      name: row.label ?? name,
      detail: row.detail ?? "",
      image: row.thumbnailUrl ?? "",
      price: money(floorByItem.get(row.itemId) ?? 0),
      change: pct(changePercent ?? 0),
      tone: row.tone as TrackerTone,
      icon: row.icon as IconName,
    }));

    const orderBook: OrderLevel[] = book.map(({ level }) => ({
      price: money(level.priceCents),
      source: level.source,
      total: money(level.totalCents),
      side: level.side,
    }));

    return { assets, orderBook, spreads: spreads.map(toSpread), chart: toChart(series) };
  },
};

/** Spread is the secondary venue over Relicto's floor; yield is that, net of fees. */
function toSpread(row: typeof marketSpreads.$inferSelect): SpreadRow {
  const spreadCents = row.secondaryCents - row.floorCents;
  const netCents = Math.round(spreadCents * (1 - row.feeBps / 10000));

  return {
    id: row.id,
    asset: row.asset,
    detail: row.detail ?? "",
    floor: money(row.floorCents),
    steam: money(row.steamCents),
    secondary: money(row.secondaryCents),
    spread: `${spreadCents >= 0 ? "+" : "-"}${money(Math.abs(spreadCents))} (${pct((spreadCents / row.floorCents) * 100)})`,
    yield: `${netCents >= 0 ? "+" : "-"}${money(Math.abs(netCents))} USD`,
    tone: row.tone as TrackerTone,
  };
}
