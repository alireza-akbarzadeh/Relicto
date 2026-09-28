import "server-only";

import { and, count, desc, eq, gt, like, max, min, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, offers, pricePoints } from "@/lib/db/schema";
import { liveOffer } from "../offers/offers.repository";

const DAY_MS = 86_400_000;

/**
 * Every item with a live copy, aggregated: floor, copies, listed value and the
 * last Steam scrape. One row per item; the stream re-reads this on every
 * market NOTIFY. (Filtering happens in memory — fine at hundreds of items;
 * push the market filter into SQL once the catalog is in the thousands.)
 */
async function findListed() {
  return db
    .select({
      itemId: items.id,
      slug: items.slug,
      name: items.name,
      gameId: items.gameId,
      rarity: items.rarity,
      slot: items.slot,
      floorCents: sql<number>`${min(listings.priceCents)}::int`,
      listings: count(listings.id),
      listedCents: sql<number>`coalesce(${sum(listings.priceCents)}, 0)::int`,
      steamCents: sql<number | null>`${max(listings.steamMarketCents)}::int`,
    })
    .from(items)
    .innerJoin(listings, and(eq(listings.itemId, items.id), eq(listings.status, "active")))
    .groupBy(items.id);
}

/** Live bids per item. */
async function findBidCounts(now: Date) {
  return db
    .select({ itemId: listings.itemId, bids: count(offers.id) })
    .from(offers)
    .innerJoin(listings, eq(offers.listingId, listings.id))
    .where(and(eq(listings.status, "active"), liveOffer(now)))
    .groupBy(listings.itemId);
}

/** The latest daily market-feed (Skinport) price per item. */
async function findLatestFeed() {
  return db
    .selectDistinctOn([pricePoints.itemId], { itemId: pricePoints.itemId, priceCents: pricePoints.priceCents, at: pricePoints.recordedAt })
    .from(pricePoints)
    .where(eq(pricePoints.venue, "skinport"))
    .orderBy(pricePoints.itemId, desc(pricePoints.recordedAt));
}

/** Relicto's settled sales in the last 24 hours. */
async function findSales(now: Date) {
  const [row] = await db
    .select({ sales: count(), cents: sql<number>`coalesce(${sum(pricePoints.priceCents)}, 0)::int` })
    .from(pricePoints)
    .where(and(like(pricePoints.id, "pp-sale-%"), gt(pricePoints.recordedAt, new Date(now.getTime() - DAY_MS))));
  return row ?? { sales: 0, cents: 0 };
}

export async function findMarketRows(now = new Date()) {
  const [listed, bids, feed, sales] = await Promise.all([findListed(), findBidCounts(now), findLatestFeed(), findSales(now)]);
  const bidsByItem = new Map(bids.map((row) => [row.itemId, row.bids]));
  const feedByItem = new Map(feed.map((row) => [row.itemId, row.priceCents]));
  const feedAt = feed.reduce<Date | null>((latest, row) => (!latest || row.at > latest ? row.at : latest), null);

  return {
    rows: listed.map((row) => ({ ...row, bids: bidsByItem.get(row.itemId) ?? 0, feedCents: feedByItem.get(row.itemId) ?? null })),
    sales,
    feedAt,
  };
}

export type MarketRows = Awaited<ReturnType<typeof findMarketRows>>;
export type MarketRow = MarketRows["rows"][number];
