import "server-only";

import { and, asc, desc, eq, min, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, itemStyles, items, listings, pricePoints } from "@/lib/db/schema";

export async function findItemBySlug(slug: string) {
  const [row] = await db
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      description: items.description,
      gameId: items.gameId,
      rarity: items.rarity,
      slot: items.slot,
      imageUrl: items.imageUrl,
      imageAlt: items.imageAlt,
      steamClassId: items.steamClassId,
      presentation: items.presentation,
      heroName: heroes.name,
    })
    .from(items)
    .leftJoin(heroes, eq(items.heroId, heroes.id))
    .where(eq(items.slug, slug))
    .limit(1);

  return row ?? null;
}

/** Every active listing of an item, cheapest first — these are the page's offers. */
export async function findItemListings(itemId: string) {
  return db
    .select({
      id: listings.id,
      priceCents: listings.priceCents,
      wear: listings.wear,
      float: listings.float,
      paintSeed: listings.paintSeed,
      stattrak: listings.stattrak,
      offerCount: listings.offerCount,
      changePercent: listings.changePercent,
      changeWindow: listings.changeWindow,
      listedAt: listings.listedAt,
    })
    .from(listings)
    .where(and(eq(listings.itemId, itemId), eq(listings.status, "active")))
    // Price-time priority: at the same price, the copy listed first leads.
    .orderBy(asc(listings.priceCents), asc(listings.listedAt));
}

export async function findItemStyles(itemId: string) {
  return db
    .select()
    .from(itemStyles)
    .where(eq(itemStyles.itemId, itemId))
    .orderBy(asc(itemStyles.sortOrder));
}

/** Oldest-first price series for the intelligence chart. */
export async function findPriceHistory(itemId: string, limit = 30) {
  const rows = await db
    .select({ priceCents: pricePoints.priceCents, recordedAt: pricePoints.recordedAt })
    .from(pricePoints)
    .where(eq(pricePoints.itemId, itemId))
    .orderBy(desc(pricePoints.recordedAt))
    .limit(limit);

  return rows.reverse();
}

/**
 * Other items in the same game, for the "related" rail — one card per item,
 * priced at its floor, however many copies are on offer.
 */
export async function findRelatedItems(excludeSlug: string, gameId: string, limit = 4) {
  const floorCents = min(listings.priceCents);

  return db
    .select({
      slug: items.slug,
      name: items.name,
      rarity: items.rarity,
      imageUrl: items.imageUrl,
      imageAlt: items.imageAlt,
      presentation: items.presentation,
      priceCents: sql<number>`${floorCents}::int`,
    })
    .from(items)
    .innerJoin(listings, and(eq(listings.itemId, items.id), eq(listings.status, "active")))
    .where(and(eq(items.gameId, gameId), ne(items.slug, excludeSlug)))
    .groupBy(items.id)
    .orderBy(desc(floorCents))
    .limit(limit);
}
