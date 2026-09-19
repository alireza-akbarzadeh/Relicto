import type { MetaCard, MetaFilter, MetaSort } from "../types";

export const META_FILTERS: { value: MetaFilter; label: string }[] = [
  { value: "all", label: "ALL TIERS" },
  { value: "carry", label: "CARRY / RIFLES" },
  { value: "mid", label: "MID / SNIPER" },
  { value: "arcana", label: "ARCANA & COVERT" },
];

export const META_SORTS: { value: MetaSort; label: string }[] = [
  { value: "spike", label: "Sort: Highest Meta Spike" },
  { value: "volume", label: "Sort: 24h Volume" },
  { value: "floor", label: "Sort: Lowest Float Value" },
];

const COMPARE: Record<MetaSort, (a: MetaCard, b: MetaCard) => number> = {
  spike: (a, b) => b.spikePct - a.spikePct,
  volume: (a, b) => b.volume24h - a.volume24h,
  floor: (a, b) => a.floorUsd - b.floorUsd,
};

/** Cards in the chosen tier, ordered by the chosen metric. */
export function selectMetaCards(cards: MetaCard[], filter: MetaFilter, sort: MetaSort) {
  const visible = filter === "all" ? cards : cards.filter((card) => card.filters.includes(filter));
  return [...visible].sort(COMPARE[sort]);
}
