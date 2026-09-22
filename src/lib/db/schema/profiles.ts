import { index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { items } from "./catalog";

/**
 * Public trader identity. Split from Better Auth's `user` table so auth stays
 * owned by the library and the trading profile can grow independently.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    handle: text("handle").notNull(),
    realName: text("real_name"),
    alias: text("alias"),
    role: text("role").notNull().default("Trader"),
    /** Accent the role badge renders in, beside the handle. */
    roleTone: text("role_tone").notNull().default("muted"),
    tier: text("tier"),
    level: integer("level").notNull().default(1),
    steamId: text("steam_id"),
    openId: text("open_id"),
    avatar: text("avatar"),
    banner: text("banner"),
    tradeUrl: text("trade_url"),
    /** Percent, 0–100. */
    trustScore: integer("trust_score").notNull().default(0),
    tradeCount: integer("trade_count").notNull().default(0),
    /** Rolling median time to hand an item off, shown on the vendor card. */
    fulfillmentSeconds: integer("fulfillment_seconds"),
    /** One-line pitch under the handle on the vendor card. */
    blurb: text("blurb"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("profiles_user_idx").on(t.userId),
    uniqueIndex("profiles_handle_idx").on(t.handle),
    index("profiles_steam_id_idx").on(t.steamId),
  ],
);

/** Items pinned to the profile showcase rail. */
export const showcaseItems = pgTable(
  "showcase_items",
  {
    id: primaryId(),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    itemId: text("item_id").references(() => items.id, { onDelete: "set null" }),
    kicker: text("kicker"),
    name: text("name").notNull(),
    subtitle: text("subtitle"),
    valueCents: integer("value_cents"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("showcase_items_profile_idx").on(t.profileId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: primaryId(),
    /** The trader being reviewed. */
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    quote: text("quote").notNull(),
    /** 1–5. */
    rating: integer("rating"),
    ...timestamps,
  },
  (t) => [index("reviews_profile_idx").on(t.profileId)],
);
