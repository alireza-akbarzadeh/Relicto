import "server-only";

import { and, asc, desc, eq, like, min, ne, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, itemStyles, items, listings, pricePoints, profiles, user } from "@/lib/db/schema";

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

export async function findItemStyles(itemId: string) {
  return db
    .select()
    .from(itemStyles)
    .where(eq(itemStyles.itemId, itemId))
    .orderBy(asc(itemStyles.sortOrder));
}

/**
 * Real observations only, oldest first: the daily market snapshot (Skinport's
 * lowest ask) and Relicto's own settled sales. The seed's generated series
 * are left out — they belong to the tracker's sample board, not to a chart
 * that claims to be history. A year of dailies covers every range pill.
 */
export async function findPriceHistory(itemId: string, limit = 400) {
  const rows = await db
    .select({ priceCents: pricePoints.priceCents, recordedAt: pricePoints.recordedAt, venue: pricePoints.venue })
    .from(pricePoints)
    .where(and(eq(pricePoints.itemId, itemId), or(eq(pricePoints.venue, "skinport"), like(pricePoints.id, "pp-sale-%"))))
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

/**
 * Everyone selling this item right now, cheapest first, with who they are —
 * the page's price facts and its seller book. Price-time priority: at the same
 * price, the copy listed first leads.
 */
export async function findItemSellers(itemId: string) {
  return db
    .select({ listing: listings, name: user.name, verified: user.emailVerified, profile: profiles })
    .from(listings)
    .innerJoin(user, eq(listings.sellerId, user.id))
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(and(eq(listings.itemId, itemId), eq(listings.status, "active")))
    .orderBy(asc(listings.priceCents), asc(listings.listedAt));
}

export type SellerRow = Awaited<ReturnType<typeof findItemSellers>>[number];
