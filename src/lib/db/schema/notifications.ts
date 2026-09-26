import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";

export const notificationTone = pgEnum("notification_tone", ["success", "warning", "info", "alert"]);

/** What happened — drives the copy, and lets traders mute a kind later. */
export const notificationKind = pgEnum("notification_kind", [
  "order_received",
  "trade_offer_sent",
  "item_sold",
  "item_delivered",
  "order_cancelled",
  "offer_received",
  "offer_accepted",
  "offer_declined",
  "system",
]);

/** Feeds the header bell. `icon` is a Material-name string the UI maps to a glyph. */
export const notifications = pgTable(
  "notifications",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: notificationKind("kind").notNull().default("system"),
    icon: text("icon").notNull(),
    tone: notificationTone("tone").notNull().default("info"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    href: text("href"),
    unread: boolean("unread").notNull().default(true),
    /**
     * One event notifies each person once, however often its source retries —
     * a bot webhook delivered twice must not buzz a phone twice.
     */
    dedupeKey: text("dedupe_key"),
    ...createdAt,
  },
  (t) => [
    index("notifications_user_unread_idx").on(t.userId, t.unread),
    index("notifications_created_at_idx").on(t.createdAt),
    uniqueIndex("notifications_dedupe_idx").on(t.dedupeKey),
  ],
);

/** A browser or installed app that accepted Web Push for a trader. */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** The push service URL; unique per browser install. */
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    lastSuccessAt: timestamp("last_success_at"),
    ...timestamps,
  },
  (t) => [uniqueIndex("push_subscriptions_endpoint_idx").on(t.endpoint), index("push_subscriptions_user_idx").on(t.userId)],
);
