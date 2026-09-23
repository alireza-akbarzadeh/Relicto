import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems, items, listings, walletAccounts } from "@/lib/db/schema";
import type { IconName } from "@/components/ui/icon";
import type { CheckoutData, CheckoutItem } from "@/modules/checkout/types";
import { PAYMENT_RAILS, sessionCode } from "./checkout.rails";

const WEAR: Record<string, string> = { fn: "FN", mw: "MW", ft: "FT", ww: "WW", bs: "BS" };

/** Bundle relief once the basket reaches this many items, in dollars. */
const COMBO_THRESHOLD = 3;
const COMBO_DISCOUNT = 25;
const PROMO_DISCOUNT = 15;

type CartRow = {
  cartId: string;
  listing: typeof listings.$inferSelect;
  name: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

function toCheckoutItem(row: CartRow): CheckoutItem {
  const { listing } = row;
  const p = listing.checkout;
  const market = listing.steamMarketCents;

  return {
    id: row.cartId,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    badge: p?.badge ?? "",
    badgeTone: p?.badgeTone ?? "",
    game: p?.game ?? "",
    gameTone: p?.gameTone ?? "",
    name: p?.name ?? row.name,
    ...(p?.subname ? { subname: p.subname } : {}),
    ...(p?.category ? { category: p.category } : {}),
    detail: p?.detail ?? "",
    intel: listing.intel ?? [],
    bot: listing.botName ?? "Relicto Sentinel",
    price: listing.priceCents / 100,
    ...(market !== null ? { marketPrice: market / 100 } : {}),
    // The saving is a fact about the two prices, so it is never stored.
    ...(market !== null && market > 0
      ? { discountPercentage: Math.round(((market - listing.priceCents) / market) * 100) }
      : {}),
    ...(listing.wear ? { wear: WEAR[listing.wear] } : {}),
    ...(listing.float !== null ? { floatValue: listing.float } : {}),
    ...(listing.paintSeed !== null ? { paintSeed: listing.paintSeed } : {}),
    // A CS2 copy's marker is its grade and float, so it tracks the listing
    // rather than whatever was authored when the card was designed.
    marker: listing.wear && listing.float !== null ? `${WEAR[listing.wear]} ${listing.float}` : (p?.marker ?? ""),
    markerTone: p?.markerTone ?? "",
    ...(p?.icon ? { icon: p.icon as IconName } : {}),
  };
}

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const checkoutService = {
  /** The trader's basket, priced, with the rails they can pay on. */
  async basket(userId: string): Promise<CheckoutData | null> {
    const [rows, [wallet]] = await Promise.all([
      db
        .select({
          cartId: cartItems.id,
          listing: listings,
          name: items.name,
          imageUrl: items.imageUrl,
          imageAlt: items.imageAlt,
        })
        .from(cartItems)
        .innerJoin(listings, eq(cartItems.listingId, listings.id))
        .innerJoin(items, eq(listings.itemId, items.id))
        .where(eq(cartItems.userId, userId))
        .orderBy(asc(cartItems.createdAt)),
      db.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).limit(1),
    ]);

    if (rows.length === 0) return null;

    const subtotalCents = rows.reduce((sum, row) => sum + row.listing.priceCents, 0);
    const comboDiscount = rows.length >= COMBO_THRESHOLD ? COMBO_DISCOUNT : 0;
    const dueCents = subtotalCents - (comboDiscount + PROMO_DISCOUNT) * 100;
    const remainingCents = (wallet?.balanceCents ?? 0) - dueCents;

    return {
      session: sessionCode(rows.map((row) => row.cartId)),
      items: rows.map(toCheckoutItem),
      paymentRails: PAYMENT_RAILS(wallet?.balanceCents ?? 0),
      subtotal: subtotalCents / 100,
      comboDiscount,
      promoDiscount: PROMO_DISCOUNT,
      walletAfter: `${money(Math.abs(remainingCents))} USD ${remainingCents >= 0 ? "Remaining" : "Short"}`,
    };
  },
};
