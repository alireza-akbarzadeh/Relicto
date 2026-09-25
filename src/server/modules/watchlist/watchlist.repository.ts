import "server-only";

import { asc, eq, inArray, min, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, watchlist } from "@/lib/db/schema";

/**
 * Every item a trader watches, with the market facts a watcher actually wants:
 * what it costs right now and which copy they'd get. The floor is the cheapest
 * *active* listing, so an item nobody is selling reads as unavailable rather
 * than quoting a stale price.
 */
export async function findWatchedItems(userId: string) {
  /** Cheapest active listing per item, as a joinable subquery. */
  const floors = db
    .select({
      itemId: listings.itemId,
      floorCents: min(listings.priceCents).as("floor_cents"),
    })
    .from(listings)
    .where(eq(listings.status, "active"))
    .groupBy(listings.itemId)
    .as("floors");

  return db
    .select({
      slug: items.slug,
      name: items.name,
      gameId: items.gameId,
      rarity: items.rarity,
      imageUrl: items.imageUrl,
      imageAlt: items.imageAlt,
      presentation: items.presentation,
      label: watchlist.label,
      detail: watchlist.detail,
      tone: watchlist.tone,
      watchedAt: watchlist.createdAt,
      sortOrder: watchlist.sortOrder,
      floorCents: floors.floorCents,
      /* The exact copy the floor refers to, so "Add to basket" reserves that one. */
      listingId: sql<string | null>`(
        select l.id from ${listings} l
        where l.item_id = ${items.id} and l.status = 'active'
        order by l.price_cents asc, l.id asc
        limit 1
      )`,
      changePercent: sql<number | null>`(
        select l.change_percent from ${listings} l
        where l.item_id = ${items.id} and l.status = 'active'
        order by l.price_cents asc, l.id asc
        limit 1
      )`,
      offerCount: sql<number>`(
        select count(*)::int from ${listings} l
        where l.item_id = ${items.id} and l.status = 'active'
      )`,
    })
    .from(watchlist)
    .innerJoin(items, eq(watchlist.itemId, items.id))
    .leftJoin(floors, eq(floors.itemId, items.id))
    .where(eq(watchlist.userId, userId))
    .orderBy(asc(watchlist.sortOrder), asc(watchlist.createdAt));
}

/** How many traders watch each of these items — the item page's "N watching". */
export async function countWatchersBySlug(slugs: string[]) {
  if (!slugs.length) return new Map<string, number>();

  const rows = await db
    .select({ slug: items.slug, watchers: sql<number>`count(*)::int` })
    .from(watchlist)
    .innerJoin(items, eq(watchlist.itemId, items.id))
    .where(inArray(items.slug, slugs))
    .groupBy(items.slug);

  return new Map(rows.map((row) => [row.slug, row.watchers]));
}

export type WatchedRow = Awaited<ReturnType<typeof findWatchedItems>>[number];
