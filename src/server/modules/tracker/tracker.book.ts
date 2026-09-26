import "server-only";

import { and, asc, count, desc, eq, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, offers } from "@/lib/db/schema";
import type { LiveBook } from "@/modules/tracker/types";
import { liveOffer } from "../offers/offers.repository";

/** Levels per side — enough to read the book at a glance. */
const DEPTH = 8;

export type BookSide = { priceCents: number; quantity: number }[];
export type BookRows = { asks: BookSide; bids: BookSide; depthCents: number };

/** The focus item by slug, with what the terminal header shows. */
export async function findFocusItem(slug: string) {
  const [row] = await db
    .select({ id: items.id, slug: items.slug, name: items.name, gameId: items.gameId, rarity: items.rarity, imageUrl: items.imageUrl, imageAlt: items.imageAlt })
    .from(items)
    .where(eq(items.slug, slug))
    .limit(1);
  return row ?? null;
}

/**
 * Relicto's own order book for one item: every active listing is an ask, every
 * live offer on one of its copies a bid, each side grouped by price.
 */
export async function findBookRows(itemId: string, now = new Date()): Promise<BookRows> {
  const [asks, bids, [depth]] = await Promise.all([
    db
      .select({ priceCents: listings.priceCents, quantity: count() })
      .from(listings)
      .where(and(eq(listings.itemId, itemId), eq(listings.status, "active")))
      .groupBy(listings.priceCents)
      .orderBy(asc(listings.priceCents))
      .limit(DEPTH),
    db
      .select({ priceCents: offers.priceCents, quantity: count() })
      .from(offers)
      .innerJoin(listings, eq(offers.listingId, listings.id))
      .where(and(eq(listings.itemId, itemId), eq(listings.status, "active"), liveOffer(now)))
      .groupBy(offers.priceCents)
      .orderBy(desc(offers.priceCents))
      .limit(DEPTH),
    db
      .select({ cents: sql<number>`coalesce(${sum(listings.priceCents)}, 0)::int` })
      .from(listings)
      .where(and(eq(listings.itemId, itemId), eq(listings.status, "active"))),
  ]);
  return { asks, bids, depthCents: depth?.cents ?? 0 };
}

/** The stream's snapshot: both sides, the touch, the spread and the depth. */
export function toLiveBook(slug: string, rows: BookRows, now = new Date()): LiveBook {
  const bestAsk = rows.asks[0]?.priceCents ?? null;
  const bestBid = rows.bids[0]?.priceCents ?? null;
  const spread = bestAsk !== null && bestBid !== null ? bestAsk - bestBid : null;
  const level = (row: BookSide[number]) => ({ priceUsd: row.priceCents / 100, quantity: row.quantity });

  return {
    slug,
    asks: rows.asks.map(level),
    bids: rows.bids.map(level),
    bestAsk: bestAsk !== null ? bestAsk / 100 : null,
    bestBid: bestBid !== null ? bestBid / 100 : null,
    spreadUsd: spread !== null ? spread / 100 : null,
    spreadPct: spread !== null && bestAsk ? (spread / bestAsk) * 100 : null,
    depthUsd: rows.depthCents / 100,
    at: now.toISOString(),
  };
}

/** The live book for a slug, or null when the item doesn't exist. */
export async function liveBook(slug: string): Promise<{ itemId: string; book: LiveBook } | null> {
  const item = await findFocusItem(slug);
  if (!item) return null;
  return { itemId: item.id, book: toLiveBook(slug, await findBookRows(item.id)) };
}
