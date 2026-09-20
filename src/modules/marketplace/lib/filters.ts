import { CATALOG_META, ECOSYSTEMS, RARITIES, SAFEGUARDS } from "../data/facets.mock";
import type { Filters, FloatBand, Listing, SortKey } from "../types";

/** The criteria selected on the designed screen. */
export const DEFAULT_FILTERS: Filters = {
  query: "",
  ecosystem: "dota2",
  heroes: ["Phantom Assassin"],
  rarities: ["arcana", "immortal"],
  slots: [],
  price: { min: 0, max: 1000, preset: "100to500" },
  safeguards: ["instantEscrow", "verifiedSellers"],
  sort: "change",
  view: "grid",
  page: 1,
  perPage: 24,
  wear: [],
  float: "any",
  stattrak: false,
};

/** Everything cleared ("Reset All"). */
export const EMPTY_FILTERS: Filters = {
  ...DEFAULT_FILTERS,
  ecosystem: "all",
  heroes: [],
  rarities: [],
  price: { min: 0, max: 100_000, preset: null },
  safeguards: [],
};

const criteriaKey = ({ query, ecosystem, heroes, rarities, slots, price, safeguards, wear, float, stattrak }: Filters) =>
  JSON.stringify({ query, ecosystem, heroes, rarities, slots, price, safeguards, wear, float, stattrak });

/** True while the user hasn't changed any search criteria from the designed state. */
export const isPristine = (filters: Filters) =>
  criteriaKey(filters) === criteriaKey(DEFAULT_FILTERS) && filters.sort === DEFAULT_FILTERS.sort;

/** Float bands offered by the CS2 facet. */
const IN_BAND: Record<FloatBand, (value: number) => boolean> = {
  any: () => true,
  under001: (value) => value < 0.01,
  under01: (value) => value < 0.1,
  over01: (value) => value >= 0.1,
};

function matchesCs2(listing: Listing, f: Filters) {
  if (!f.wear.length && f.float === "any" && !f.stattrak) return true;
  const spec = listing.cs2;
  if (!spec) return false;
  if (f.wear.length && !f.wear.includes(spec.wear)) return false;
  if (!IN_BAND[f.float](spec.float)) return false;
  if (f.stattrak && !spec.stattrak) return false;
  return true;
}

function matches(listing: Listing, f: Filters) {
  const q = f.query.trim().toLowerCase();
  if (q && !`${listing.name} ${listing.subtitle} ${listing.detail.label} ${listing.hero ?? ""}`.toLowerCase().includes(q)) return false;
  if (f.ecosystem !== "all" && listing.game !== f.ecosystem) return false;
  if (f.heroes.length && listing.game === "dota2" && !f.heroes.includes(listing.hero ?? "")) return false;
  if (f.rarities.length && listing.rarity && !f.rarities.includes(listing.rarity)) return false;
  if (f.slots.length && !f.slots.includes(listing.slot ?? "")) return false;
  if (listing.priceUsd < f.price.min || listing.priceUsd > f.price.max) return false;
  if (!matchesCs2(listing, f)) return false;
  return f.safeguards.every((s) => listing.safeguards.includes(s));
}

const SORTERS: Record<SortKey, (a: Listing, b: Listing) => number> = {
  "price-asc": (a, b) => a.priceUsd - b.priceUsd,
  "price-desc": (a, b) => b.priceUsd - a.priceUsd,
  change: (a, b) => b.change.percent - a.change.percent,
  volume: (a, b) => b.offers - a.offers,
  recent: (a, b) => b.listedAt - a.listedAt,
};

export type ListingResults = { items: Listing[]; total: number; pages: number; from: number; to: number };

/**
 * Mock search. In the untouched designed state it returns the curated first
 * page with the server's totals; any change filters and sorts the catalog locally.
 */
export function searchListings(catalog: Listing[], f: Filters): ListingResults {
  if (isPristine(f)) {
    const shift = ((f.page - 1) * 3) % catalog.length;
    const items = [...catalog.slice(shift), ...catalog.slice(0, shift)];
    const from = (f.page - 1) * f.perPage + 1;
    return { items, total: CATALOG_META.total, pages: CATALOG_META.pages, from, to: from + items.length - 1 };
  }
  const found = catalog.filter((l) => matches(l, f)).sort(SORTERS[f.sort]);
  const pages = Math.max(1, Math.ceil(found.length / f.perPage));
  const page = Math.min(f.page, pages);
  const items = found.slice((page - 1) * f.perPage, page * f.perPage);
  const from = items.length ? (page - 1) * f.perPage + 1 : 0;
  return { items, total: found.length, pages, from, to: from ? from + items.length - 1 : 0 };
}

export type CriteriaChip = { id: string; label: string; tone: "plain" | "quality" | "escrow"; clear: Partial<Filters> };

/** Primary criteria shown as removable chips above the grid (game, quality, escrow). */
export function criteriaChips(f: Filters): CriteriaChip[] {
  const chips: CriteriaChip[] = [];
  if (f.ecosystem !== "all") {
    const label = ECOSYSTEMS.find((e) => e.value === f.ecosystem)?.label ?? f.ecosystem;
    chips.push({ id: "ecosystem", label, tone: "plain", clear: { ecosystem: "all" } });
  }
  if (f.rarities.length) {
    const names = f.rarities.map((r) => RARITIES.find((x) => x.value === r)?.label ?? r);
    chips.push({ id: "rarity", label: `${names.join(" / ")} Quality`, tone: "quality", clear: { rarities: [] } });
  }
  if (f.wear.length) {
    chips.push({ id: "wear", label: `${f.wear.map((w) => w.toUpperCase()).join(" / ")} Wear`, tone: "quality", clear: { wear: [] } });
  }
  if (f.float !== "any") {
    const label = f.float === "over01" ? "Float 0.10+" : f.float === "under01" ? "Float < 0.10" : "Float < 0.01";
    chips.push({ id: "float", label, tone: "quality", clear: { float: "any" } });
  }
  if (f.stattrak) {
    chips.push({ id: "stattrak", label: "StatTrak™", tone: "escrow", clear: { stattrak: false } });
  }
  const escrow = SAFEGUARDS.find((s) => s.value === "instantEscrow");
  if (f.safeguards.includes("instantEscrow") && escrow?.chip) {
    chips.push({
      id: "escrow",
      label: escrow.chip,
      tone: "escrow",
      clear: { safeguards: f.safeguards.filter((s) => s !== "instantEscrow") },
    });
  }
  return chips;
}

export function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
