import { index, integer, jsonb, pgEnum, pgTable, real, text, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { items } from "./catalog";

/** Live node/session readouts printed across the profile banner. */
export type ProfileTelemetry = { label: string; tone?: string; pulse?: boolean }[];

/** Game rank chips beside the handle ("STEAM LVL 94", "DOTA 2: DIVINE V"). */
export type ProfileRanks = { label: string; value: string; tone: string; dot?: boolean; icon?: string }[];

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
    avatarAlt: text("avatar_alt"),
    banner: text("banner"),
    bannerAlt: text("banner_alt"),
    tradeUrl: text("trade_url"),
    telemetry: jsonb("telemetry").$type<ProfileTelemetry>(),
    ranks: jsonb("ranks").$type<ProfileRanks>(),
    /** Round-trip time to the trade bot ("12ms Handshake"). */
    handshakeLabel: text("handshake_label"),
    /** When Valve's API last answered, as the profile prints it. */
    lastHandshake: text("last_handshake"),
    /**
     * Cached aggregates. Recomputing a full Steam inventory appraisal or a
     * lifetime review average on every page load would be absurd, so the
     * profile carries the last known figures.
     */
    inventoryCount: integer("inventory_count").notNull().default(0),
    /** Steam inventory size per game ({ cs2: 128, dota2: 46 }). */
    inventoryCounts: jsonb("inventory_counts").$type<Record<string, number>>(),
    portfolioCents: integer("portfolio_cents").notNull().default(0),
    portfolioChangePercent: real("portfolio_change_percent"),
    reviewCount: integer("review_count").notNull().default(0),
    /** 4.98 stored as 498, so the average survives as an integer. */
    ratingHundredths: integer("rating_hundredths").notNull().default(0),
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

/** Badge, wear meter and footnotes on one showcase card. */
export type ShowcasePresentation = {
  badge: { icon: string; label: string };
  meter: { label: string; value: string; pct: number; gradient?: boolean };
  foot: { left: string; right: string };
};

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
    /** The showcase crop, not the catalog art. */
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    tone: text("tone").notNull().default("muted"),
    presentation: jsonb("presentation").$type<ShowcasePresentation>(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("showcase_items_profile_idx").on(t.profileId)],
);

/** Which tab a status row belongs to. */
export const profileStatusGroup = pgEnum("profile_status_group", ["security", "linked", "safeguards"]);

/** Account readouts: 2FA state, linked Steam keys, escrow safeguards. */
export const profileStatusRows = pgTable(
  "profile_status_rows",
  {
    id: primaryId(),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    group: profileStatusGroup("group").notNull(),
    icon: text("icon").notNull(),
    iconTone: text("icon_tone").notNull().default("muted"),
    title: text("title").notNull(),
    detail: text("detail"),
    status: text("status").notNull(),
    statusTone: text("status_tone").notNull().default("muted"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("profile_status_rows_profile_idx").on(t.profileId, t.group)],
);

/** Buyer-voted service scores shown as meters. */
export const profileEndorsements = pgTable(
  "profile_endorsements",
  {
    id: primaryId(),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    /** Percent, 0–100. */
    pct: real("pct").notNull(),
    tone: text("tone").notNull().default("muted"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("profile_endorsements_profile_idx").on(t.profileId)],
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
    /** Handle at review time — the account may be renamed or deleted later. */
    authorHandle: text("author_handle").notNull().default("trader"),
    quote: text("quote").notNull(),
    /** 1–5. */
    rating: integer("rating"),
    ...timestamps,
  },
  (t) => [index("reviews_profile_idx").on(t.profileId)],
);
