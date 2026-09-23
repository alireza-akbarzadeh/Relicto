/**
 * The basket, seeded from `checkout.mock`. The merchandising each row shows
 * belongs to the listing, so the cart itself stays what it should be: a link
 * between a trader and a listing.
 */
import { and, eq, inArray, like, or, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { checkout } from "../../modules/checkout/data/checkout.mock";

type Db = NodePgDatabase<typeof schema>;
type Wear = (typeof schema.itemWear.enumValues)[number];

/**
 * Which listing backs each basket row. The basket's AK-47 is a Well-Worn copy
 * of pattern #571 from another seller — the Minimal Wear one on the profile
 * storefront belongs to the trader, and nobody can buy their own listing.
 */
const BASKET: Record<string, { listingId: string; copyOf?: string }> = {
  butterfly: { listingId: "listing-butterfly-doppler" },
  manifold: { listingId: "listing-manifold-paradox" },
  "case-hardened": { listingId: "listing-ak-case-hardened-ww", copyOf: "ak-case-hardened" },
};

/**
 * Purchases made through the real checkout carry a `chk` id prefix. Undo them
 * so a re-seed always starts from the designed state.
 */
async function clearCheckoutOrders(db: Db, buyerId: string) {
  const mine = and(eq(schema.orders.buyerId, buyerId), like(schema.orders.id, "order-chk-%"));
  const reserved = await db
    .select({ orderId: schema.orders.id, code: schema.orders.code, listingId: schema.orderItems.listingId })
    .from(schema.orderItems)
    .innerJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
    .where(mine);

  const listingIds = reserved.flatMap((row) => (row.listingId ? [row.listingId] : []));
  if (listingIds.length) {
    await db.update(schema.listings).set({ status: "active" }).where(inArray(schema.listings.id, listingIds));
  }

  const orderIds = reserved.map((row) => row.orderId);
  if (orderIds.length) {
    // Sellers paid out by a completed test trade give the payout back first.
    const payouts = await db
      .select({ walletId: schema.ledgerEntries.walletId, amountCents: schema.ledgerEntries.amountCents })
      .from(schema.ledgerEntries)
      .where(and(inArray(schema.ledgerEntries.orderId, orderIds), eq(schema.ledgerEntries.kind, "sale")));
    for (const payout of payouts) {
      await db
        .update(schema.walletAccounts)
        .set({ balanceCents: sql`${schema.walletAccounts.balanceCents} - ${payout.amountCents}` })
        .where(eq(schema.walletAccounts.id, payout.walletId));
    }

    await db.delete(schema.ledgerEntries).where(inArray(schema.ledgerEntries.orderId, orderIds));
    await db
      .delete(schema.notifications)
      .where(or(...reserved.map((row) => like(schema.notifications.dedupeKey, `${row.code}:%`))));
  }

  await db
    .delete(schema.ledgerEntries)
    .where(and(eq(schema.ledgerEntries.walletId, `wallet-${buyerId}`), like(schema.ledgerEntries.id, "ledger-chk-%")));
  await db.delete(schema.orders).where(mine);
}

/** A second copy of a catalog item, listed by someone other than the buyer. */
async function upsertCopy(db: Db, row: { listingId: string; slug: string; sellerId: string }, item: (typeof checkout.items)[number]) {
  const values = {
    id: row.listingId,
    itemId: `item-${row.slug}`,
    sellerId: row.sellerId,
    priceCents: Math.round(item.price * 100),
    status: "active",
    wear: (item.wear?.toLowerCase() ?? null) as Wear | null,
    float: item.floatValue ?? null,
    paintSeed: item.paintSeed ?? null,
    listedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  } satisfies typeof schema.listings.$inferInsert;

  await db.insert(schema.listings).values(values).onConflictDoUpdate({ target: schema.listings.id, set: values });
}

export async function seedCheckout(db: Db, buyerId: string, sellerId: string) {
  await clearCheckoutOrders(db, buyerId);
  await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, buyerId));

  for (const [order, item] of checkout.items.entries()) {
    const row = BASKET[item.id];
    if (!row) continue;

    if (row.copyOf) await upsertCopy(db, { listingId: row.listingId, slug: row.copyOf, sellerId }, item);

    const [catalog] = await db
      .select({ name: schema.items.name })
      .from(schema.listings)
      .innerJoin(schema.items, eq(schema.listings.itemId, schema.items.id))
      .where(eq(schema.listings.id, row.listingId));

    await db
      .update(schema.listings)
      .set({
        status: "active",
        botName: item.bot,
        intel: item.intel,
        steamMarketCents: item.marketPrice ? Math.round(item.marketPrice * 100) : null,
        // The basket shows the seller's shot of this copy, not the catalog art.
        imageUrl: item.image,
        imageAlt: item.imageAlt,
        checkout: {
          ...(catalog && catalog.name !== item.name ? { name: item.name } : {}),
          badge: item.badge,
          badgeTone: item.badgeTone,
          game: item.game,
          gameTone: item.gameTone,
          category: item.category,
          detail: item.detail,
          marker: item.marker,
          markerTone: item.markerTone,
          subname: item.subname,
          icon: item.icon,
        },
      })
      .where(eq(schema.listings.id, row.listingId));

    await db.insert(schema.cartItems).values({
      id: `cart-${buyerId}-${item.id}`,
      userId: buyerId,
      listingId: row.listingId,
      // Ordered by creation, so the basket keeps the designed sequence.
      createdAt: new Date(Date.now() - (checkout.items.length - order) * 60_000),
    });
  }

  return checkout.items.length;
}
