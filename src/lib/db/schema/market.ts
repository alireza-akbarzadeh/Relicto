import { boolean, index, integer, pgEnum, pgTable, real, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { itemStyles, items } from "./catalog";

/** CS2 exterior grades; null on Dota 2 cosmetics. */
export const itemWear = pgEnum("item_wear", ["fn", "mw", "ft", "ww", "bs"]);
export const listingStatus = pgEnum("listing_status", ["active", "reserved", "sold", "cancelled"]);
export const offerFulfilment = pgEnum("offer_fulfilment", ["bot", "p2p"]);
export const offerStatus = pgEnum("offer_status", ["pending", "accepted", "declined", "expired"]);

export const listings = pgTable(
  "listings",
  {
    id: primaryId(),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    styleId: text("style_id").references(() => itemStyles.id, { onDelete: "set null" }),
    priceCents: integer("price_cents").notNull(),
    status: listingStatus("status").notNull().default("active"),
    /** CS2 economy facets the marketplace filters on. */
    wear: itemWear("wear"),
    float: real("float"),
    paintSeed: integer("paint_seed"),
    stattrak: boolean("stattrak").notNull().default(false),
    listedAt: timestamp("listed_at").notNull().defaultNow(),
    soldAt: timestamp("sold_at"),
    ...timestamps,
  },
  (t) => [
    index("listings_item_idx").on(t.itemId),
    index("listings_seller_idx").on(t.sellerId),
    index("listings_status_idx").on(t.status),
    index("listings_price_idx").on(t.priceCents),
    index("listings_listed_at_idx").on(t.listedAt),
    index("listings_wear_idx").on(t.wear),
  ],
);

export const offers = pgTable(
  "offers",
  {
    id: primaryId(),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    priceCents: integer("price_cents").notNull(),
    fulfilment: offerFulfilment("fulfilment").notNull().default("bot"),
    status: offerStatus("status").notNull().default("pending"),
    note: text("note"),
    expiresAt: timestamp("expires_at"),
    ...timestamps,
  },
  (t) => [
    index("offers_listing_idx").on(t.listingId),
    index("offers_buyer_idx").on(t.buyerId),
    index("offers_status_idx").on(t.status),
  ],
);

/** Items a trader follows; drives "you follow this item" price alerts. */
export const watchlist = pgTable(
  "watchlist",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    ...createdAt,
  },
  (t) => [uniqueIndex("watchlist_user_item_idx").on(t.userId, t.itemId), index("watchlist_user_idx").on(t.userId)],
);
