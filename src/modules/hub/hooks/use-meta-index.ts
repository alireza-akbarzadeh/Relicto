"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { hubSearchParams } from "../lib/search-params";
import { selectMetaCards } from "../lib/meta-index";
import type { MetaCard, MetaFilter, MetaSort } from "../types";

/** Tier filter + sort for the Meta Cosmetic Index, kept in the URL. */
export function useMetaIndex(cards: MetaCard[]) {
  const [filter, setFilter] = useQueryState("tier", hubSearchParams.tier.withOptions({ history: "replace", clearOnDefault: true }));
  const [sort, setSort] = useQueryState("sort", hubSearchParams.sort.withOptions({ history: "replace", clearOnDefault: true }));

  const visible = useMemo(() => selectMetaCards(cards, filter, sort), [cards, filter, sort]);

  return {
    filter,
    setFilter: (next: MetaFilter) => void setFilter(next),
    sort,
    setSort: (next: MetaSort) => void setSort(next),
    visible,
  };
}
