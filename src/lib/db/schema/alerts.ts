import { boolean, index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { items } from "./catalog";

export const alertKind = pgEnum("alert_kind", ["snipe", "dca", "arb"]);
export const alertDirection = pgEnum("alert_direction", ["below", "above"]);
export const alertStatus = pgEnum("alert_status", ["armed", "triggered", "paused"]);
export const alertChannelKind = pgEnum("alert_channel_kind", ["email", "telegram", "discord", "push", "sms"]);

export const alertRules = pgTable(
  "alert_rules",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "cascade" }),
    kind: alertKind("kind").notNull().default("snipe"),
    name: text("name").notNull(),
    /** The exact variant being watched ("Phase 4 · Factory New"). */
    detail: text("detail"),
    /** Glyph on the rule row, chosen when the rule is created. */
    icon: text("icon").notNull().default("notifications"),
    direction: alertDirection("direction").notNull().default("below"),
    targetCents: integer("target_cents").notNull(),
    /**
     * Last observed market price. Rules can watch items Relicto doesn't list,
     * so the live floor is preferred and this is the fallback.
     */
    currentCents: integer("current_cents"),
    status: alertStatus("status").notNull().default("armed"),
    lastTriggeredAt: timestamp("last_triggered_at"),
    ...timestamps,
  },
  (t) => [
    index("alert_rules_user_idx").on(t.userId),
    index("alert_rules_item_idx").on(t.itemId),
    index("alert_rules_status_idx").on(t.status),
  ],
);

/** Where a fired rule gets delivered. */
export const alertChannels = pgTable(
  "alert_channels",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: alertChannelKind("kind").notNull(),
    handle: text("handle").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("alert_channels_user_idx").on(t.userId)],
);

/** Append-only log of every rule that fired, and where it was sent. */
export const alertEvents = pgTable(
  "alert_events",
  {
    id: primaryId(),
    ruleId: text("rule_id")
      .notNull()
      .references(() => alertRules.id, { onDelete: "cascade" }),
    channelId: text("channel_id").references(() => alertChannels.id, { onDelete: "set null" }),
    priceCents: integer("price_cents").notNull(),
    message: text("message"),
    deliveredAt: timestamp("delivered_at"),
    ...createdAt,
  },
  (t) => [index("alert_events_rule_idx").on(t.ruleId)],
);
