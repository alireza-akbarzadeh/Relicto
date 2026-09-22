import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, primaryId } from "./_shared";
import { items } from "./catalog";

/** Where a quote came from; the tracker compares Relicto against outside venues. */
export const priceVenue = pgEnum("price_venue", ["relicto", "steam", "buff", "skinport", "csfloat"]);

/**
 * Time series behind the price chart, tracker spreads and alert evaluation.
 * Append-only: one row per (item, venue, observation).
 */
export const pricePoints = pgTable(
  "price_points",
  {
    id: primaryId(),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    venue: priceVenue("venue").notNull().default("relicto"),
    priceCents: integer("price_cents").notNull(),
    /** Listings open at this price when the sample was taken. */
    volume: integer("volume"),
    recordedAt: timestamp("recorded_at").notNull().defaultNow(),
    ...createdAt,
  },
  (t) => [
    index("price_points_item_recorded_idx").on(t.itemId, t.recordedAt),
    index("price_points_venue_idx").on(t.venue),
  ],
);
