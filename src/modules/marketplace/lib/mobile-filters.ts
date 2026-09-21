import type { MobileCategory, MobileListing, MobileSort, PriceBand } from "../mobile.types";

export type MobileCriteria = {
  q: string;
  cat: MobileCategory;
  msort: MobileSort;
  band: PriceBand;
  lowFloat: boolean;
};

/** Float ceiling of the "Float < 0.08" chip. */
export const LOW_FLOAT = 0.08;

export const SORT_LABEL: Record<MobileSort, string> = {
  spikes: "Spikes",
  movers: "Top Movers",
  "price-desc": "Price: High",
  "price-asc": "Price: Low",
};

export const BAND_LABEL: Record<PriceBand, string> = {
  any: "Any Price",
  under50: "Under $50",
  "50to6k": "$50 - $6k",
  over6k: "$6k+",
};

const BAND_RANGE: Record<PriceBand, [number, number]> = {
  any: [0, Infinity],
  under50: [0, 50],
  "50to6k": [50, 6000],
  over6k: [6000, Infinity],
};

function matchesCategory(listing: MobileListing, cat: MobileCategory) {
  if (cat === "all") return true;
  if (cat === "dota2" || cat === "cs2") return listing.game === cat;
  return listing.categories.includes(cat);
}

function matchesQuery(listing: MobileListing, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [listing.name, listing.subtitle, listing.tag].some((field) => field.toLowerCase().includes(needle));
}

const SORTERS: Record<MobileSort, ((a: MobileListing, b: MobileListing) => number) | null> = {
  spikes: null,
  movers: (a, b) => b.changePct - a.changePct,
  "price-desc": (a, b) => b.priceUsd - a.priceUsd,
  "price-asc": (a, b) => a.priceUsd - b.priceUsd,
};

/** Search, category, price band, float and sort. "Spikes" keeps the engine's trending rank. */
export function filterMobileListings(listings: MobileListing[], criteria: MobileCriteria) {
  const [min, max] = BAND_RANGE[criteria.band];
  const matches = listings.filter(
    (listing) =>
      matchesQuery(listing, criteria.q) &&
      matchesCategory(listing, criteria.cat) &&
      listing.priceUsd >= min &&
      listing.priceUsd <= max &&
      (!criteria.lowFloat || (listing.float !== undefined && listing.float < LOW_FLOAT)),
  );
  const sorter = SORTERS[criteria.msort];
  return sorter ? [...matches].sort(sorter) : matches;
}

/** Percent-change colour: breakouts crimson, gains amber, flat muted. */
export function changeTone(changePct: number) {
  if (changePct >= 10) return "text-primary-container";
  if (changePct >= 1) return "text-tertiary";
  return "text-text-secondary";
}
