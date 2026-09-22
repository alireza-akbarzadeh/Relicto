import { index, integer, pgEnum, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { items } from "./catalog";
import { listings } from "./market";

export const tradeUpStatus = pgEnum("trade_up_status", ["draft", "submitted", "settled", "failed"]);

/** The forge: N inputs burned for one outcome item. */
export const tradeUpContracts = pgTable(
  "trade_up_contracts",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: tradeUpStatus("status").notNull().default("draft"),
    inputValueCents: integer("input_value_cents").notNull().default(0),
    outcomeItemId: text("outcome_item_id").references(() => items.id, { onDelete: "set null" }),
    outcomeValueCents: integer("outcome_value_cents"),
    /** Win chance quoted at submit time, 0–100. */
    oddsPct: real("odds_pct"),
    settledAt: timestamp("settled_at"),
    ...timestamps,
  },
  (t) => [index("trade_up_contracts_user_idx").on(t.userId), index("trade_up_contracts_status_idx").on(t.status)],
);

export const tradeUpItems = pgTable(
  "trade_up_items",
  {
    id: primaryId(),
    contractId: text("contract_id")
      .notNull()
      .references(() => tradeUpContracts.id, { onDelete: "cascade" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "set null" }),
    listingId: text("listing_id").references(() => listings.id, { onDelete: "set null" }),
    slot: integer("slot").notNull(),
    valueCents: integer("value_cents").notNull().default(0),
    ...createdAt,
  },
  (t) => [index("trade_up_items_contract_idx").on(t.contractId)],
);
