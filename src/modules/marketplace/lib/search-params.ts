import {
  createLoader,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import type { EcosystemFilter, Filters } from "../types";

/* Allowed values. Anything else in the URL falls back to the default. */
export const ECOSYSTEM_VALUES = ["all", "dota2", "cs2", "tf2"] as const;
export const RARITY_VALUES = ["arcana", "immortal", "ancient", "mythical", "rare"] as const;
export const SAFEGUARD_VALUES = ["instantEscrow", "verifiedSellers", "gems", "allStyles"] as const;
export const SORT_VALUES = ["price-asc", "price-desc", "change", "volume", "recent"] as const;
export const VIEW_VALUES = ["grid", "list"] as const;
export const PRESET_VALUES = ["under25", "25to100", "100to500", "over500"] as const;
export const PER_PAGE_VALUES = [24, 48, 96] as const;

/** CS2-only facets: wear tier, float band and StatTrak. */
export const WEAR_VALUES = ["fn", "mw", "ft", "ww", "bs"] as const;
export const FLOAT_VALUES = ["any", "under001", "under01", "over01"] as const;

/** No criterion is worth filtering on; the ceiling doubles as "no maximum". */
export const NO_PRICE_CEILING = 100_000;

/**
 * The marketplace URL contract. Postgres applies these for real, so the
 * defaults are the *unfiltered* catalog: what the sidebar shows ticked is
 * always what narrowed the grid.
 *
 * The Stitch screen was drawn with Dota 2 + Arcana/Immortal + two safeguards
 * ticked over a grid of unfiltered cards — a state no honest query produces.
 * Ticking those boxes reproduces that sidebar exactly; the grid then shows
 * what it actually selects. nuqs omits any value still at its default, so the
 * landing URL stays clean.
 */
export const marketplaceSearchParams = {
  q: parseAsString.withDefault(""),
  game: parseAsStringLiteral(ECOSYSTEM_VALUES).withDefault("all"),
  heroes: parseAsArrayOf(parseAsString, ",").withDefault([]),
  rarity: parseAsArrayOf(parseAsStringLiteral(RARITY_VALUES), ",").withDefault([]),
  slots: parseAsArrayOf(parseAsString, ",").withDefault([]),
  wear: parseAsArrayOf(parseAsStringLiteral(WEAR_VALUES), ",").withDefault([]),
  float: parseAsStringLiteral(FLOAT_VALUES).withDefault("any"),
  stattrak: parseAsBoolean.withDefault(false),
  min: parseAsFloat.withDefault(0),
  max: parseAsFloat.withDefault(NO_PRICE_CEILING),
  preset: parseAsStringLiteral(PRESET_VALUES),
  safe: parseAsArrayOf(parseAsStringLiteral(SAFEGUARD_VALUES), ",").withDefault([]),
  sort: parseAsStringLiteral(SORT_VALUES).withDefault("change"),
  view: parseAsStringLiteral(VIEW_VALUES).withDefault("grid"),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(PER_PAGE_VALUES).withDefault(24),
};

export type MarketplaceQuery = { [K in keyof typeof marketplaceSearchParams]: ReturnType<(typeof marketplaceSearchParams)[K]["parseServerSide"]> };

/** Read the same contract on the server (metadata, future API calls). */
export const loadMarketplaceSearchParams = createLoader(marketplaceSearchParams);

/** URL values → the `Filters` shape the catalog search already understands. */
export function toFilters(query: MarketplaceQuery): Filters {
  return {
    query: query.q,
    ecosystem: query.game,
    heroes: query.heroes,
    rarities: query.rarity,
    slots: query.slots,
    price: { min: query.min, max: query.max, preset: query.preset },
    safeguards: query.safe,
    sort: query.sort,
    view: query.view,
    page: query.page,
    perPage: query.perPage,
    wear: query.wear,
    float: query.float,
    stattrak: query.stattrak,
  };
}

/** `Filters` → URL values, for `patch()`. */
export function toQuery(filters: Partial<Filters>): Partial<MarketplaceQuery> {
  const next: Partial<MarketplaceQuery> = {};
  if (filters.query !== undefined) next.q = filters.query;
  if (filters.ecosystem !== undefined) next.game = filters.ecosystem;
  if (filters.heroes !== undefined) next.heroes = filters.heroes;
  if (filters.rarities !== undefined) next.rarity = filters.rarities;
  if (filters.slots !== undefined) next.slots = filters.slots;
  if (filters.wear !== undefined) next.wear = filters.wear;
  if (filters.float !== undefined) next.float = filters.float;
  if (filters.stattrak !== undefined) next.stattrak = filters.stattrak;
  if (filters.price !== undefined) {
    next.min = filters.price.min;
    next.max = filters.price.max;
    next.preset = filters.price.preset;
  }
  if (filters.safeguards !== undefined) next.safe = filters.safeguards;
  if (filters.sort !== undefined) next.sort = filters.sort;
  if (filters.view !== undefined) next.view = filters.view;
  if (filters.page !== undefined) next.page = filters.page;
  if (filters.perPage !== undefined) next.perPage = filters.perPage;
  return next;
}

/**
 * Facets only apply to their own economy, so switching games drops the other
 * one's criteria instead of silently filtering everything out.
 */
export function gameReset(game: EcosystemFilter): Partial<MarketplaceQuery> {
  const dota = { heroes: [], slots: [] };
  const cs2 = { wear: [], float: "any" as const, stattrak: false };
  if (game === "cs2") return { game, ...dota };
  if (game === "dota2") return { game, ...cs2 };
  return { game, ...dota, ...cs2 };
}
