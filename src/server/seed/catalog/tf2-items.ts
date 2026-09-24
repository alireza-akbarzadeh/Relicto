/**
 * Team Fortress 2 depth. The ecosystem pill has always been on the filter rail;
 * without these rows, picking it emptied the grid.
 *
 * TF2 qualities don't map onto the Dota grades the rarity facet offers, so each
 * row takes the nearest one the UI can filter (Unusual → ancient, Strange →
 * mythical, everything else → rare) and keeps its real quality in the card tag.
 */
import type { CatalogSeedItem, SeedRarity } from "./catalog.types";

/** `[name, slug, rarity, slot, priceUsd]` */
const ROWS: [string, string, SeedRarity, string, number][] = [
  ["Unusual Team Captain (Burning Flames)", "tf2-team-captain-burning", "ancient", "Head", 1640.0],
  ["Unusual Killer Exclusive (Scorching Flames)", "tf2-killer-exclusive-scorching", "ancient", "Head", 892.5],
  ["Unusual Modest Pile of Hat (Sunbeams)", "tf2-modest-pile-sunbeams", "ancient", "Head", 418.0],
  ["Unusual Brain Bucket (Cloud 9)", "tf2-brain-bucket-cloud9", "ancient", "Head", 236.4],
  ["Unusual Ghastly Gibus (Circling Peace Sign)", "tf2-ghastly-gibus-peace", "ancient", "Head", 74.9],
  ["Strange Australium Rocket Launcher", "tf2-australium-rocket-launcher", "mythical", "Weapon", 128.6],
  ["Strange Australium Scattergun", "tf2-australium-scattergun", "mythical", "Weapon", 96.2],
  ["Strange Australium Sniper Rifle", "tf2-australium-sniper-rifle", "mythical", "Weapon", 84.5],
  ["Strange Australium Minigun", "tf2-australium-minigun", "mythical", "Weapon", 71.8],
  ["Strange Australium Medi Gun", "tf2-australium-medi-gun", "mythical", "Weapon", 62.3],
  ["Strange Professional Killstreak Knife", "tf2-pro-killstreak-knife", "mythical", "Weapon", 34.7],
  ["Strange Specialized Killstreak Eyelander", "tf2-killstreak-eyelander", "mythical", "Weapon", 18.9],
  ["Genuine Dead of Night", "tf2-dead-of-night", "rare", "Armor", 21.4],
  ["Vintage Dr. Grordbort's Crest", "tf2-grordborts-crest", "rare", "Head", 15.7],
  ["Collector's Festive Flame Thrower", "tf2-festive-flame-thrower", "rare", "Weapon", 27.8],
  ["Mann Co. Supply Crate Key", "tf2-supply-crate-key", "rare", "Armor", 2.45],
  ["Refined Metal Bundle", "tf2-refined-metal-bundle", "rare", "Armor", 1.85],
  ["Taunt: The Schadenfreude", "tf2-taunt-schadenfreude", "rare", "Taunts", 6.9],
  ["Taunt: Conga", "tf2-taunt-conga", "rare", "Taunts", 9.3],
  ["Robotic Boogaloo Courier Crate", "tf2-robotic-boogaloo-crate", "rare", "Couriers", 4.2],
];

export const TF2_ITEMS: CatalogSeedItem[] = ROWS.map(([name, slug, rarity, slot, priceUsd]) => ({
  slug,
  gameId: "tf2" as const,
  name,
  rarity,
  slot,
  priceUsd,
}));
