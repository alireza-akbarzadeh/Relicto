import "server-only";

import type { Filters } from "@/modules/marketplace/types";
import type { ListListingsInput } from "./listings.schema";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Float bands the CS2 facet offers, as bounds the query understands. */
const FLOAT_BOUNDS: Record<Filters["float"], { maxFloat?: number; minFloat?: number }> = {
  any: {},
  under001: { maxFloat: 0.01 },
  under01: { maxFloat: 0.1 },
  over01: { minFloat: 0.1 },
};

/**
 * The marketplace URL state, as a repository query. One place owns the mapping,
 * so the grid, the totals and the facet tallies can't drift apart.
 */
export function toListingQuery(filters: Filters): Partial<ListListingsInput> {
  const dota = filters.ecosystem !== "cs2";
  const cs2 = filters.ecosystem === "cs2" || filters.ecosystem === "all";

  return {
    query: filters.query.trim() || undefined,
    gameId: filters.ecosystem === "all" ? undefined : filters.ecosystem,
    /* Facets only apply to their own economy — the sidebar hides the others. */
    heroSlugs: dota && filters.heroes.length ? filters.heroes.map(slugify) : undefined,
    rarities: filters.rarities.length ? filters.rarities : undefined,
    slots: dota && filters.slots.length ? filters.slots : undefined,
    minCents: filters.price.min > 0 ? Math.round(filters.price.min * 100) : undefined,
    maxCents: Math.round(filters.price.max * 100),
    wear: cs2 && filters.wear.length ? filters.wear : undefined,
    ...(cs2 ? FLOAT_BOUNDS[filters.float] : {}),
    stattrak: cs2 && filters.stattrak ? true : undefined,
    safeguards: filters.safeguards.length ? filters.safeguards : undefined,
    sort: filters.sort,
    page: filters.page,
    perPage: filters.perPage,
  };
}
