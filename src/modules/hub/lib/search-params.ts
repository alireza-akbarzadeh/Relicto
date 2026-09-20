import { createLoader, parseAsStringLiteral } from "nuqs/server";

export const GAME_VALUES = ["dota", "cs2", "cross"] as const;
export const META_FILTER_VALUES = ["all", "carry", "mid", "arcana"] as const;
export const META_SORT_VALUES = ["spike", "volume", "floor"] as const;

/** Game hub URL contract: which economy is spotlighted and how the index is cut. */
export const hubSearchParams = {
  game: parseAsStringLiteral(GAME_VALUES).withDefault("dota"),
  tier: parseAsStringLiteral(META_FILTER_VALUES).withDefault("all"),
  sort: parseAsStringLiteral(META_SORT_VALUES).withDefault("spike"),
};

export const loadHubSearchParams = createLoader(hubSearchParams);
