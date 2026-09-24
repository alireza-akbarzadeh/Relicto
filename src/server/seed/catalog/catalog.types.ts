/**
 * The shape every generated catalog entry shares. The designed 18 items keep
 * their hand-authored seeds; these are the depth behind them, so the
 * marketplace facets, pagination and totals count something real.
 */
import type * as schema from "../../../lib/db/schema";

export type SeedRarity = (typeof schema.itemRarity.enumValues)[number];
export type SeedWear = (typeof schema.itemWear.enumValues)[number];

export type CatalogSeedItem = {
  /** Unique across the whole catalog — must not collide with the designed 18. */
  slug: string;
  gameId: "dota2" | "cs2" | "tf2";
  name: string;
  rarity: SeedRarity;
  slot: string;
  /** Dota 2 only; creates the hero row the marketplace hero facet reads. */
  hero?: string;
  priceUsd: number;
  /** CS2 only. */
  wear?: SeedWear;
  float?: number;
  stattrak?: boolean;
  pattern?: number;
};

/** `[hero, name, slug, rarity, slot, priceUsd]` — the Dota 2 rows compress to this. */
export type DotaTuple = [string, string, string, SeedRarity, string, number];

/** `[name, slug, rarity, wear, float, stattrak, pattern, priceUsd]`. */
export type Cs2Tuple = [string, string, SeedRarity, SeedWear, number, boolean, number, number];

export const fromDota = ([hero, name, slug, rarity, slot, priceUsd]: DotaTuple): CatalogSeedItem => ({
  slug,
  gameId: "dota2",
  name,
  rarity,
  slot,
  hero,
  priceUsd,
});

export const fromCs2 = ([name, slug, rarity, wear, float, stattrak, pattern, priceUsd]: Cs2Tuple): CatalogSeedItem => ({
  slug,
  gameId: "cs2",
  name,
  rarity,
  slot: rarity === "gloves" ? "Gloves" : "Weapon",
  priceUsd,
  wear,
  float,
  stattrak,
  pattern,
});
