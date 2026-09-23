import "server-only";

import { and, asc, count, eq, exists, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { alertRules, items, listings, orders, showcaseItems } from "@/lib/db/schema";

/** Showcase cards with the item they link to, and whether the trader has it listed right now. */
export async function findShowcaseCards(profileId: string, userId: string) {
  return db
    .select({
      card: showcaseItems,
      slug: items.slug,
      listed: exists(
        db
          .select({ id: listings.id })
          .from(listings)
          .where(and(eq(listings.itemId, showcaseItems.itemId), eq(listings.sellerId, userId), eq(listings.status, "active"))),
      ),
    })
    .from(showcaseItems)
    .leftJoin(items, eq(showcaseItems.itemId, items.id))
    .where(eq(showcaseItems.profileId, profileId))
    .orderBy(asc(showcaseItems.sortOrder));
}

/** Trade counts behind the trust tiles and the quick-link badges, from either side of each order. */
export async function countActivity(userId: string) {
  const party = or(eq(orders.buyerId, userId), eq(orders.sellerId, userId));
  const [trades] = await db
    .select({
      total: count(),
      disputed: sql<number>`count(*) filter (where ${orders.state} = 'disputed')::int`,
      open: sql<number>`count(*) filter (where ${orders.state} = 'escrow')::int`,
    })
    .from(orders)
    .where(party);

  const [[listed], [armed]] = await Promise.all([
    db.select({ value: count() }).from(listings).where(and(eq(listings.sellerId, userId), eq(listings.status, "active"))),
    db.select({ value: count() }).from(alertRules).where(and(eq(alertRules.userId, userId), eq(alertRules.status, "armed"))),
  ]);

  return {
    trades: trades?.total ?? 0,
    disputed: trades?.disputed ?? 0,
    openEscrows: trades?.open ?? 0,
    listed: listed?.value ?? 0,
    armedAlerts: armed?.value ?? 0,
  };
}
