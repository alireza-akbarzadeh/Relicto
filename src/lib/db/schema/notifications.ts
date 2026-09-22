import { boolean, index, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, primaryId } from "./_shared";
import { user } from "./auth";

export const notificationTone = pgEnum("notification_tone", ["success", "warning", "info", "alert"]);

/** Feeds the header bell. `icon` is a Material-name string the UI maps to a glyph. */
export const notifications = pgTable(
  "notifications",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    icon: text("icon").notNull(),
    tone: notificationTone("tone").notNull().default("info"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    href: text("href"),
    unread: boolean("unread").notNull().default(true),
    ...createdAt,
  },
  (t) => [
    index("notifications_user_unread_idx").on(t.userId, t.unread),
    index("notifications_created_at_idx").on(t.createdAt),
  ],
);
