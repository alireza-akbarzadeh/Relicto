import { index, integer, pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";

/** Union of every rarity/category the Dota 2 and CS2 screens render. */
export const itemRarity = pgEnum("item_rarity", [
  "arcana",
  "exalted",
  "immortal",
  "ancient",
  "mythical",
  "rare",
  "persona",
  "helm",
  "cache",
  "covert",
  "melee",
  "gloves",
]);

/** Steam ecosystems: `id` is the slug the UI already filters on ("dota2", "cs2", "tf2"). */
export const games = pgTable("games", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  steamAppId: integer("steam_app_id"),
  ...timestamps,
});

export const heroes = pgTable(
  "heroes",
  {
    id: primaryId(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("heroes_game_slug_idx").on(t.gameId, t.slug), index("heroes_game_idx").on(t.gameId)],
);

export const items = pgTable(
  "items",
  {
    id: primaryId(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    heroId: text("hero_id").references(() => heroes.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    rarity: itemRarity("rarity"),
    /** Equip slot ("Weapon", "Head", "Gloves"...) — free text, the UI facets on it. */
    slot: text("slot"),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    /** Steam inventory identifiers, used when binding a real inventory. */
    steamClassId: text("steam_class_id"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("items_slug_idx").on(t.slug),
    index("items_game_idx").on(t.gameId),
    index("items_hero_idx").on(t.heroId),
    index("items_rarity_idx").on(t.rarity),
    index("items_slot_idx").on(t.slot),
  ],
);

/** Arcana / weapon styles unlocked per item. */
export const itemStyles = pgTable(
  "item_styles",
  {
    id: primaryId(),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    name: text("name").notNull(),
    requirement: text("requirement"),
    note: text("note"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("item_styles_item_idx").on(t.itemId)],
);
