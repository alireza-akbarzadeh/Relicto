import "server-only";

import { and, asc, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { escrowEvents, games, items, orderItems, orders, profiles, tradeOffers, user } from "@/lib/db/schema";

/** Codes are shown with a `#`, stored without one. */
const bare = (code: string) => code.replace(/^#/, "").toUpperCase();

/** Only the two parties to an order can open it; anyone else gets null. */
export async function findOrderByCode(code: string, viewerId: string) {
  const [row] = await db
    .select({
      order: orders,
      line: orderItems,
      gameName: games.name,
      rarity: items.rarity,
      itemImage: items.imageUrl,
      itemImageAlt: items.imageAlt,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .leftJoin(games, eq(items.gameId, games.id))
    .where(and(eq(orders.code, bare(code)), or(eq(orders.buyerId, viewerId), eq(orders.sellerId, viewerId))))
    .limit(1);

  return row ?? null;
}

export async function findEscrowEvents(orderId: string) {
  return db
    .select()
    .from(escrowEvents)
    .where(eq(escrowEvents.orderId, orderId))
    .orderBy(asc(escrowEvents.step));
}

export async function findTradeOffer(orderId: string) {
  const [row] = await db.select().from(tradeOffers).where(eq(tradeOffers.orderId, orderId)).limit(1);
  return row ?? null;
}

/** The counterparty's public card on the tracker. */
export async function findVendorProfile(userId: string | null) {
  if (!userId) return null;
  const [row] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return row ?? null;
}

/** False only on a database nobody has seeded — the one case the sample stands in. */
export async function hasOrders() {
  const [row] = await db.select({ id: orders.id }).from(orders).limit(1);
  return Boolean(row);
}

/** One side of an order as the tracker names it, plus their Steam trade URL for the seller to send to. */
export async function findParty(userId: string | null) {
  if (!userId) return null;
  const [row] = await db
    .select({ name: user.name, handle: profiles.handle, tradeUrl: profiles.tradeUrl })
    .from(user)
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(eq(user.id, userId))
    .limit(1);
  return row ?? null;
}

export type Party = NonNullable<Awaited<ReturnType<typeof findParty>>>;
