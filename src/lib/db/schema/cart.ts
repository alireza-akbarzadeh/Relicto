import { index, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { listings } from "./market";

/** The trade basket. One row per reserved listing, per trader. */
export const cartItems = pgTable(
  "cart_items",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("cart_items_user_listing_idx").on(t.userId, t.listingId),
    index("cart_items_user_idx").on(t.userId),
  ],
);
