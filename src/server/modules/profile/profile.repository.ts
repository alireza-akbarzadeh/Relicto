import "server-only";

import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  items,
  listings,
  orders,
  profileEndorsements,
  profiles,
  profileStatusRows,
  reviews,
  showcaseItems,
} from "@/lib/db/schema";

export async function findProfile(userId: string) {
  const [row] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return row ?? null;
}

export async function findShowcase(profileId: string) {
  return db
    .select()
    .from(showcaseItems)
    .where(eq(showcaseItems.profileId, profileId))
    .orderBy(asc(showcaseItems.sortOrder));
}

/** The trader's own live listings, as the profile's listings tab renders them. */
export async function findSellerListings(userId: string) {
  return db
    .select({
      listing: listings,
      name: items.name,
      imageUrl: items.imageUrl,
      imageAlt: items.imageAlt,
      presentation: items.presentation,
    })
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .where(and(eq(listings.sellerId, userId), eq(listings.status, "active")))
    .orderBy(desc(listings.listedAt));
}

export async function findStatusRows(profileId: string) {
  return db
    .select()
    .from(profileStatusRows)
    .where(eq(profileStatusRows.profileId, profileId))
    .orderBy(asc(profileStatusRows.sortOrder));
}

export async function findEndorsements(profileId: string) {
  return db
    .select()
    .from(profileEndorsements)
    .where(eq(profileEndorsements.profileId, profileId))
    .orderBy(asc(profileEndorsements.sortOrder));
}

export async function findReviews(profileId: string, limit = 4) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.profileId, profileId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

/** Thirty days of settled selling, for the volume tile. */
export async function sumRecentSales(userId: string, now = new Date()) {
  const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [row] = await db
    .select({
      cents: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
      trades: sql<number>`count(*)::int`,
      completed: sql<number>`count(*) filter (where ${orders.state} = 'completed')::int`,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, userId), gte(orders.placedAt, since)));

  return { cents: row?.cents ?? 0, trades: row?.trades ?? 0, completed: row?.completed ?? 0 };
}
