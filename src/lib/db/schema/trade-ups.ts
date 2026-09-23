import { sql } from "drizzle-orm";
import { index, integer, pgEnum, pgTable, real, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { games, items } from "./catalog";
import { inventoryItems } from "./inventory";
import { listings } from "./market";

export const tradeUpStatus = pgEnum("trade_up_status", ["draft", "submitted", "settled", "failed"]);

/**
 * What a contract can forge into, with its odds. Real CS2 derives the pool from
 * the inputs' collections; Relicto doesn't carry collection data yet, so the
 * pool is stored per game. `tone` is the one piece of art direction: it picks
 * the row's accent, its tier wording and its verdict.
 */
export const tradeUpOutcomes = pgTable(
  "trade_up_outcomes",
  {
    id: primaryId(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    valueCents: integer("value_cents").notNull(),
    /** Share of the draw, 0–100. The pool's chances are normalised at draw time. */
    chancePct: real("chance_pct").notNull(),
    tone: text("tone").notNull().default("mid"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("trade_up_outcomes_game_idx").on(t.gameId, t.sortOrder)],
);

/** The forge: N inputs burned for one outcome item. */
export const tradeUpContracts = pgTable(
  "trade_up_contracts",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: tradeUpStatus("status").notNull().default("draft"),
    /** Shown before Ignite ("Seed #09472") so the trader can quote the contract. */
    seed: integer("seed").notNull().default(0),
    inputValueCents: integer("input_value_cents").notNull().default(0),
    outcomeId: text("outcome_id").references(() => tradeUpOutcomes.id, { onDelete: "set null" }),
    outcomeItemId: text("outcome_item_id").references(() => items.id, { onDelete: "set null" }),
    outcomeValueCents: integer("outcome_value_cents"),
    /** Win chance quoted at submit time, 0–100. */
    oddsPct: real("odds_pct"),
    settledAt: timestamp("settled_at"),
    ...timestamps,
  },
  (t) => [
    index("trade_up_contracts_user_idx").on(t.userId),
    index("trade_up_contracts_status_idx").on(t.status),
    /** One open draft per trader, so two tabs can't fork the chamber. */
    uniqueIndex("trade_up_contracts_one_draft_idx").on(t.userId).where(sql`${t.status} = 'draft'`),
  ],
);

export const tradeUpItems = pgTable(
  "trade_up_items",
  {
    id: primaryId(),
    contractId: text("contract_id")
      .notNull()
      .references(() => tradeUpContracts.id, { onDelete: "cascade" }),
    /** The trader's copy committed to the slot; cleared once the contract burns it. */
    inventoryItemId: text("inventory_item_id").references(() => inventoryItems.id, { onDelete: "set null" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "set null" }),
    listingId: text("listing_id").references(() => listings.id, { onDelete: "set null" }),
    slot: integer("slot").notNull(),
    valueCents: integer("value_cents").notNull().default(0),
    ...createdAt,
  },
  (t) => [
    index("trade_up_items_contract_idx").on(t.contractId),
    uniqueIndex("trade_up_items_contract_slot_idx").on(t.contractId, t.slot),
    index("trade_up_items_inventory_idx").on(t.inventoryItemId),
  ],
);
