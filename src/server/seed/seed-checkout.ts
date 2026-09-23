/**
 * The basket, seeded from `checkout.mock`. The merchandising each row shows
 * belongs to the listing, so the cart itself stays what it should be: a link
 * between a trader and a listing.
 */
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { checkout } from "../../modules/checkout/data/checkout.mock";

type Db = NodePgDatabase<typeof schema>;

/** Which catalog listing backs each basket row. */
const BASKET: Record<string, string> = {
  butterfly: "butterfly-doppler",
  manifold: "manifold-paradox",
  "case-hardened": "ak-case-hardened",
};

export async function seedCheckout(db: Db, buyerId: string) {
  await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, buyerId));

  for (const [order, item] of checkout.items.entries()) {
    const slug = BASKET[item.id];
    if (!slug) continue;

    const listingId = `listing-${slug}`;

    await db
      .update(schema.listings)
      .set({
        botName: item.bot,
        intel: item.intel,
        steamMarketCents: item.marketPrice ? Math.round(item.marketPrice * 100) : null,
        checkout: {
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
      .where(eq(schema.listings.id, listingId));

    await db.insert(schema.cartItems).values({
      id: `cart-${buyerId}-${slug}`,
      userId: buyerId,
      listingId,
      // Ordered by creation, so the basket keeps the designed sequence.
      createdAt: new Date(Date.now() - (checkout.items.length - order) * 60_000),
    });
  }

  return checkout.items.length;
}
