import "server-only";

import { and, asc, count, eq, isNotNull, max, min, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, heroes, items, listings } from "@/lib/db/schema";

/** Live copies of one item: how many, and the cheapest and dearest ask. */
const book = db
  .select({
    itemId: listings.itemId,
    offerCount: count().as("offer_count"),
    lowCents: min(listings.priceCents).as("low_cents"),
    highCents: max(listings.priceCents).as("high_cents"),
    listedAt: max(listings.listedAt).as("last_listed_at"),
  })
  .from(listings)
  .where(eq(listings.status, "active"))
  .groupBy(listings.itemId)
  .as("book");

/**
 * What an item page tells search engines: identity, game and live market
 * facts. Separate from the page loader, which needs the viewer and the whole
 * seller book; metadata needs neither.
 */
export async function findItemSeo(slug: string) {
  const [row] = await db
    .select({
      slug: items.slug,
      name: items.name,
      description: items.description,
      gameId: items.gameId,
      gameName: games.name,
      rarity: items.rarity,
      slot: items.slot,
      heroName: heroes.name,
      imageUrl: items.imageUrl,
      imageAlt: items.imageAlt,
      updatedAt: items.updatedAt,
      offerCount: sql<number>`coalesce(${book.offerCount}, 0)::int`,
      lowCents: book.lowCents,
      highCents: book.highCents,
    })
    .from(items)
    .innerJoin(games, eq(games.id, items.gameId))
    .leftJoin(heroes, eq(heroes.id, items.heroId))
    .leftJoin(book, eq(book.itemId, items.id))
    .where(eq(items.slug, slug))
    .limit(1);

  return row ?? null;
}

export type ItemSeoRow = NonNullable<Awaited<ReturnType<typeof findItemSeo>>>;

/**
 * Items worth a sitemap entry: the same rule the page uses to allow indexing
 * (an image, plus a description or a live listing). `lastModified` is the
 * later of the catalog edit and the newest listing — both change the page.
 */
const indexable = and(isNotNull(items.imageUrl), sql`(${items.description} is not null or ${book.offerCount} > 0)`);

export async function countSitemapItems() {
  const [row] = await db.select({ total: count() }).from(items).leftJoin(book, eq(book.itemId, items.id)).where(indexable);
  return row?.total ?? 0;
}

export async function findSitemapItems(offset: number, limit: number) {
  return db
    .select({
      slug: items.slug,
      imageUrl: items.imageUrl,
      updatedAt: sql<Date>`greatest(${items.updatedAt}, coalesce(${book.listedAt}, ${items.updatedAt}))`.mapWith(
        (value: string | Date) => new Date(value),
      ),
    })
    .from(items)
    .leftJoin(book, eq(book.itemId, items.id))
    .where(indexable)
    .orderBy(asc(items.slug))
    .limit(limit)
    .offset(offset);
}
