"use client";

import { useMemo, useState } from "react";
import { selectMetaCards } from "../lib/meta-index";
import type { MetaCard, MetaFilter, MetaSort } from "../types";

/** Tier filter + sort state for the Meta Cosmetic Index. */
export function useMetaIndex(cards: MetaCard[]) {
  const [filter, setFilter] = useState<MetaFilter>("all");
  const [sort, setSort] = useState<MetaSort>("spike");
  const visible = useMemo(() => selectMetaCards(cards, filter, sort), [cards, filter, sort]);
  return { filter, setFilter, sort, setSort, visible };
}
