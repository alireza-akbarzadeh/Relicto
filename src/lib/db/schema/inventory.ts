import { index, integer, pgTable, real, text, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { games, items } from "./catalog";
import { listings } from "./market";

/**
 * A copy the trader owns but hasn't necessarily listed — the seller studio's
 * left-hand rail. Mirrors a Steam inventory, so `itemId` is nullable: Steam
 * holds plenty Relicto doesn't carry in its catalog, and the labels Steam gives
 * back ("Tier 2 Gem", "1,420 Kills") don't always map onto catalog fields.
 */
export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "set null" }),
    /** Set once the copy is on the market. */
    listingId: text("listing_id").references(() => listings.id, { onDelete: "set null" }),
    /** Steam's own identifier for this exact copy. */
    assetId: text("asset_id"),
    name: text("name").notNull(),
    /** Corner chip over the thumbnail ("P4", "#571", "4x"). */
    marker: text("marker"),
    rarityLabel: text("rarity_label"),
    /** Exterior for CS2, the hero for Dota cosmetics. */
    wearLabel: text("wear_label"),
    /** Float as Steam prints it, or a counter ("1,420 Kills"). */
    floatLabel: text("float_label"),
    /** Optional pattern standing ("Rank #18", "72% Blue"). */
    rankLabel: text("rank_label"),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    /** What the studio suggests listing at, and the current market floor. */
    priceCents: integer("price_cents").notNull().default(0),
    floorCents: integer("floor_cents").notNull().default(0),
    /** Wear bar fill, 0–100. */
    wearPct: real("wear_pct").notNull().default(0),
    tone: text("tone").notNull().default("muted"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("inventory_items_user_idx").on(t.userId, t.gameId),
    uniqueIndex("inventory_items_user_asset_idx").on(t.userId, t.assetId),
  ],
);
