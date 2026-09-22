import { boolean, index, integer, pgEnum, pgTable, real, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { items } from "./catalog";
import { itemWear, listings } from "./market";

export const orderFlow = pgEnum("order_flow", ["buy", "sell", "liquidate"]);
export const orderState = pgEnum("order_state", ["escrow", "completed", "disputed", "cancelled"]);
export const escrowStepState = pgEnum("escrow_step_state", ["done", "active", "queued"]);
export const tradeOfferStatus = pgEnum("trade_offer_status", ["pending", "sent", "accepted", "declined", "expired"]);

export const orders = pgTable(
  "orders",
  {
    id: primaryId(),
    /** Human-facing tracking code shown across the ledger ("LT-88291"). */
    code: text("code").notNull(),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sellerId: text("seller_id").references(() => user.id, { onDelete: "set null" }),
    flow: orderFlow("flow").notNull(),
    state: orderState("state").notNull().default("escrow"),
    subtotalCents: integer("subtotal_cents").notNull(),
    feeCents: integer("fee_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    placedAt: timestamp("placed_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    autoCancelSeconds: integer("auto_cancel_seconds"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("orders_code_idx").on(t.code),
    index("orders_buyer_idx").on(t.buyerId),
    index("orders_seller_idx").on(t.sellerId),
    index("orders_state_idx").on(t.state),
    index("orders_placed_at_idx").on(t.placedAt),
  ],
);

/**
 * Line items snapshot name and price at purchase time — a listing can be
 * relisted or deleted, but the ledger row must stay readable forever.
 */
export const orderItems = pgTable(
  "order_items",
  {
    id: primaryId(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    listingId: text("listing_id").references(() => listings.id, { onDelete: "set null" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "set null" }),
    nameSnapshot: text("name_snapshot").notNull(),
    priceCents: integer("price_cents").notNull(),
    wear: itemWear("wear"),
    float: real("float"),
    paintSeed: integer("paint_seed"),
    stattrak: boolean("stattrak").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

/** Append-only escrow timeline behind the live order tracker. */
export const escrowEvents = pgTable(
  "escrow_events",
  {
    id: primaryId(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    step: integer("step").notNull(),
    state: escrowStepState("state").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    occurredAt: timestamp("occurred_at").notNull().defaultNow(),
    ...createdAt,
  },
  (t) => [index("escrow_events_order_idx").on(t.orderId), index("escrow_events_occurred_at_idx").on(t.occurredAt)],
);

/** The Steam trade offer a bot dispatches to settle an order. */
export const tradeOffers = pgTable(
  "trade_offers",
  {
    id: primaryId(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    steamOfferId: text("steam_offer_id"),
    botName: text("bot_name"),
    botSteamId: text("bot_steam_id"),
    token: text("token"),
    offerUrl: text("offer_url"),
    status: tradeOfferStatus("status").notNull().default("pending"),
    latencyMs: integer("latency_ms"),
    ...timestamps,
  },
  (t) => [index("trade_offers_order_idx").on(t.orderId), index("trade_offers_status_idx").on(t.status)],
);
