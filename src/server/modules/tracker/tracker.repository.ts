import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, marketSpreads, orderBookLevels, pricePoints, watchlist } from "@/lib/db/schema";

/**
 * The trader's board: each watched item with its floor (cheapest copy a buyer
 * can still take) and quoted move (the first copy that has one).
 */
export async function findBoard(userId: string) {
  const board = await db
    .select({ row: watchlist, name: items.name })
    .from(watchlist)
    .innerJoin(items, eq(watchlist.itemId, items.id))
    .where(eq(watchlist.userId, userId))
    .orderBy(asc(watchlist.sortOrder));

  const itemIds = [...new Set(board.map((b) => b.row.itemId))];
  const offers = itemIds.length
    ? await db
        .select({ itemId: listings.itemId, priceCents: listings.priceCents, changePercent: listings.changePercent })
        .from(listings)
        .where(and(inArray(listings.itemId, itemIds), eq(listings.status, "active")))
        .orderBy(asc(listings.priceCents))
    : [];

  const floorByItem = new Map<string, number>();
  const changeByItem = new Map<string, number>();
  for (const offer of offers) {
    if (!floorByItem.has(offer.itemId)) floorByItem.set(offer.itemId, offer.priceCents);
    if (!changeByItem.has(offer.itemId) && offer.changePercent !== null) changeByItem.set(offer.itemId, offer.changePercent);
  }

  return board.map(({ row, name }) => ({
    row,
    name,
    floorCents: floorByItem.get(row.itemId) ?? 0,
    changePercent: changeByItem.get(row.itemId) ?? 0,
  }));
}

export type BoardRow = Awaited<ReturnType<typeof findBoard>>[number];

/** Cross-venue depth for one item, best bid first. */
export async function findBook(slug: string) {
  return db
    .select({ level: orderBookLevels })
    .from(orderBookLevels)
    .innerJoin(items, eq(orderBookLevels.itemId, items.id))
    .where(eq(items.slug, slug))
    .orderBy(desc(orderBookLevels.priceCents));
}

/** Arbitrage rows, with the item's art where the row is linked to one. */
export async function findSpreads() {
  return db
    .select({ spread: marketSpreads, imageUrl: items.imageUrl, imageAlt: items.imageAlt })
    .from(marketSpreads)
    .leftJoin(items, eq(marketSpreads.itemId, items.id))
    .orderBy(asc(marketSpreads.sortOrder));
}

export type SpreadRow = Awaited<ReturnType<typeof findSpreads>>[number];

/** Relicto's own price history of one item, oldest first. Outside venues (the daily market feed) are the item page's to plot. */
export async function findSeries(slug: string) {
  return db
    .select({ priceCents: pricePoints.priceCents })
    .from(pricePoints)
    .innerJoin(items, eq(pricePoints.itemId, items.id))
    .where(and(eq(items.slug, slug), eq(pricePoints.venue, "relicto")))
    .orderBy(asc(pricePoints.recordedAt));
}

/** The item the terminal focuses on, priced at its floor copy. */
export async function findFocus(slug: string) {
  const [row] = await db
    .select({ item: items, listing: listings })
    .from(items)
    .innerJoin(listings, and(eq(listings.itemId, items.id), eq(listings.status, "active")))
    .where(eq(items.slug, slug))
    .orderBy(asc(listings.priceCents), asc(listings.listedAt))
    .limit(1);
  return row ?? null;
}
