import "server-only";

import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems, items, listings, walletAccounts } from "@/lib/db/schema";

/** One basket row: the listing it reserves plus the catalog facts it shows. */
export const LINE = {
  cartId: cartItems.id,
  listing: listings,
  name: items.name,
  slug: items.slug,
  rarity: items.rarity,
  imageUrl: items.imageUrl,
  imageAlt: items.imageAlt,
};

/** The basket, oldest first. Copies sold or reserved since drop out of it. */
export const cartLinesWhere = (userId: string) =>
  and(eq(cartItems.userId, userId), eq(listings.status, "active"));

export async function findCartLines(userId: string) {
  return db
    .select(LINE)
    .from(cartItems)
    .innerJoin(listings, eq(cartItems.listingId, listings.id))
    .innerJoin(items, eq(listings.itemId, items.id))
    .where(cartLinesWhere(userId))
    .orderBy(asc(cartItems.createdAt));
}

export type CartLine = Awaited<ReturnType<typeof findCartLines>>[number];

export async function findWalletBalance(userId: string) {
  const [row] = await db
    .select({ balanceCents: walletAccounts.balanceCents })
    .from(walletAccounts)
    .where(eq(walletAccounts.userId, userId))
    .limit(1);

  return row?.balanceCents ?? 0;
}

/** False only on a database nobody has seeded — the one case the mock stands in. */
export async function hasCatalog() {
  const [row] = await db.select({ id: listings.id }).from(listings).limit(1);
  return Boolean(row);
}

export async function findActiveListing(id: string) {
  const [row] = await db
    .select({ id: listings.id, sellerId: listings.sellerId })
    .from(listings)
    .where(and(eq(listings.id, id), eq(listings.status, "active")))
    .limit(1);

  return row ?? null;
}

/** Cheapest active copy of an item that someone other than `buyerId` sells. */
export async function findCheapestFromOthers(slug: string, buyerId: string) {
  const [row] = await db
    .select({ id: listings.id })
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .where(and(eq(listings.status, "active"), eq(items.slug, slug), ne(listings.sellerId, buyerId)))
    .orderBy(asc(listings.priceCents))
    .limit(1);

  return row ?? null;
}

export async function insertCartLine(userId: string, listingId: string) {
  await db.insert(cartItems).values({ userId, listingId }).onConflictDoNothing();
}

/** Scoped to the owner, so one trader can never touch another's basket. */
export async function deleteCartLine(userId: string, cartId: string) {
  await db.delete(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.id, cartId)));
}

export async function deleteCart(userId: string) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}
