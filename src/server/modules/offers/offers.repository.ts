import "server-only";

import { and, count, desc, eq, gt, inArray, isNull, lte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, offers, profiles, user } from "@/lib/db/schema";

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

/** A bid the seller can still act on: pending and inside its window. */
export const liveOffer = (now: Date) =>
  and(eq(offers.status, "pending"), or(isNull(offers.expiresAt), gt(offers.expiresAt, now)));

/** Bids on the seller's copies that are still for sale, newest first. */
export async function findIncoming(sellerId: string, now = new Date()) {
  return db
    .select({
      offer: offers,
      listingId: listings.id,
      askCents: listings.priceCents,
      listingImage: listings.imageUrl,
      listingImageAlt: listings.imageAlt,
      itemName: items.name,
      itemSlug: items.slug,
      itemImage: items.imageUrl,
      itemImageAlt: items.imageAlt,
      buyerName: user.name,
      handle: profiles.handle,
      trustScore: profiles.trustScore,
      tradeCount: profiles.tradeCount,
    })
    .from(offers)
    .innerJoin(listings, eq(offers.listingId, listings.id))
    .innerJoin(items, eq(listings.itemId, items.id))
    .innerJoin(user, eq(offers.buyerId, user.id))
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(and(eq(listings.sellerId, sellerId), eq(listings.status, "active"), liveOffer(now)))
    .orderBy(desc(offers.createdAt));
}

export type IncomingRow = Awaited<ReturnType<typeof findIncoming>>[number];

/** The buyer's own open bids on the given copies. */
export async function findBids(buyerId: string, listingIds: string[], now = new Date()) {
  if (listingIds.length === 0) return [];
  return db
    .select({ id: offers.id, listingId: offers.listingId, priceCents: offers.priceCents, expiresAt: offers.expiresAt })
    .from(offers)
    .where(and(eq(offers.buyerId, buyerId), inArray(offers.listingId, listingIds), liveOffer(now)));
}

/**
 * `listings.offer_count` is what the item page and the marketplace quote as
 * "Open Offers". Every bid write recounts it, so it can't drift from the rows.
 */
export async function recount(executor: Executor, listingId: string, now = new Date()) {
  const [{ open }] = await executor
    .select({ open: count() })
    .from(offers)
    .where(and(eq(offers.listingId, listingId), liveOffer(now)));
  await executor.update(listings).set({ offerCount: open }).where(eq(listings.id, listingId));
}

/** Pending bids whose window has closed — the sweep retires them. */
export async function findLapsed(now = new Date()) {
  return db
    .select({ id: offers.id, listingId: offers.listingId })
    .from(offers)
    .where(and(eq(offers.status, "pending"), lte(offers.expiresAt, now)));
}

export async function expire(ids: string[]) {
  if (ids.length === 0) return;
  await db.update(offers).set({ status: "expired" }).where(inArray(offers.id, ids));
}
