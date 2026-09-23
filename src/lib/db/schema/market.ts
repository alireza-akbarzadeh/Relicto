import { boolean, index, integer, jsonb, pgEnum, pgTable, real, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { itemStyles, items } from "./catalog";

/** CS2 exterior grades; null on Dota 2 cosmetics. */
export const itemWear = pgEnum("item_wear", ["fn", "mw", "ft", "ww", "bs"]);
export const listingStatus = pgEnum("listing_status", ["active", "reserved", "sold", "cancelled"]);
export const offerFulfilment = pgEnum("offer_fulfilment", ["bot", "p2p"]);
export const offerStatus = pgEnum("offer_status", ["pending", "accepted", "declined", "expired"]);

/**
 * How a listing is merchandised in the basket — badge wording, tone classes,
 * the corner marker and the one-line spec. Authored, so it stays a blob.
 */
export type CheckoutPresentation = {
  /** Basket headline when it differs from the catalog name ("Butterfly Knife"). */
  name?: string;
  badge: string;
  badgeTone: string;
  game: string;
  gameTone: string;
  category?: string;
  detail: string;
  marker: string;
  markerTone: string;
  subname?: string;
  icon?: string;
};

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
    /** Cached market stats — recomputed on a schedule, not per page load. */
    offerCount: integer("offer_count").notNull().default(0),
    changePercent: real("change_percent"),
    /** Window the change covers ("24h" when null, else "7d", "30d"). */
    changeWindow: text("change_window"),
    /** Cheapest competing listing, so the seller studio can flag undercuts. */
    floorCents: integer("floor_cents"),
    /** Last scraped Steam Community Market price, when one exists. */
    steamMarketCents: integer("steam_market_cents"),
    /** Seller's own line about this copy ("4x Holographic Web Stickers"). */
    sellerNote: text("seller_note"),
    /** Buyer impressions since listing, shown in the seller studio. */
    viewCount: integer("view_count").notNull().default(0),
    /** Escrow bot assigned to hand this copy over. */
    botName: text("bot_name"),
    /** Per-copy notes the basket surfaces: nametags, stickers, gems, vendor. */
    intel: jsonb("intel").$type<string[]>(),
    /**
     * The seller's shot of this exact copy. Two copies of one skin differ in
     * wear and pattern, so the catalog art is only the fallback.
     */
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    checkout: jsonb("checkout").$type<CheckoutPresentation>(),
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

/**
 * Items a trader follows. Doubles as the tracker board, so each row carries the
 * trader's own shorthand for the asset rather than the catalog's full name.
 */
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
    /** Board shorthand ("PA Manifold Paradox"); falls back to the item name. */
    label: text("label"),
    /** What the trader is actually watching ("CS2 / Covert · Pattern #412"). */
    detail: text("detail"),
    thumbnailUrl: text("thumbnail_url"),
    icon: text("icon").notNull().default("target"),
    tone: text("tone").notNull().default("muted"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...createdAt,
  },
  (t) => [uniqueIndex("watchlist_user_item_idx").on(t.userId, t.itemId), index("watchlist_user_idx").on(t.userId)],
);

export const bookSide = pgEnum("book_side", ["buy", "sell"]);

/**
 * Aggregated depth across venues for one item. `totalCents` is the standing
 * depth at that level, not price × quantity — venues report it as a pool.
 */
export const orderBookLevels = pgTable(
  "order_book_levels",
  {
    id: primaryId(),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    /** Venue as the book prints it ("Skinport", "Relicto Floor"). */
    source: text("source").notNull(),
    side: bookSide("side").notNull(),
    priceCents: integer("price_cents").notNull(),
    totalCents: integer("total_cents").notNull(),
    ...timestamps,
  },
  (t) => [index("order_book_levels_item_idx").on(t.itemId, t.priceCents)],
);

/** Cross-venue arbitrage rows: where Relicto's floor sits against the rest. */
export const marketSpreads = pgTable(
  "market_spreads",
  {
    id: primaryId(),
    itemId: text("item_id").references(() => items.id, { onDelete: "cascade" }),
    asset: text("asset").notNull(),
    detail: text("detail"),
    floorCents: integer("floor_cents").notNull(),
    steamCents: integer("steam_cents").notNull(),
    /** Best price on the secondary venues Relicto scrapes. */
    secondaryCents: integer("secondary_cents").notNull(),
    /** Which venue that best price is on ("Skinport", "Buff163"). */
    secondaryVenue: text("secondary_venue"),
    /** Platform take on the round trip, in basis points. */
    feeBps: integer("fee_bps").notNull().default(1200),
    tone: text("tone").notNull().default("muted"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("market_spreads_item_idx").on(t.itemId)],
);
