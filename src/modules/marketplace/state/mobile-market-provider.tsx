"use client";

import { useQueryStates } from "nuqs";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { filterMobileListings, type MobileCriteria } from "../lib/mobile-filters";
import { mobileMarketSearchParams } from "../lib/mobile-search-params";
import type { MobileListing } from "../mobile.types";

type MobileMarketState = {
  criteria: MobileCriteria;
  view: "grid" | "list";
  results: MobileListing[];
  total: number;
  /** Any filter away from the designed defaults. */
  filtered: boolean;
  set: (patch: Partial<MobileCriteria & { view: "grid" | "list" }>) => void;
  reset: () => void;
};

const MobileMarketContext = createContext<MobileMarketState | null>(null);

const DEFAULTS = { q: "", cat: "all", msort: "spikes", band: "50to6k", lowFloat: false } as const;

/** URL-backed state of the mobile marketplace (nuqs). The watchlist is app-wide (`useWatchlist`). */
export function MobileMarketProvider({ listings, children }: { listings: MobileListing[]; children: ReactNode }) {
  const [query, setQuery] = useQueryStates(mobileMarketSearchParams, { history: "replace", clearOnDefault: true });

  const value = useMemo<MobileMarketState>(() => {
    const { view, ...criteria } = query;
    return {
      criteria,
      view,
      results: filterMobileListings(listings, criteria),
      total: listings.length,
      filtered: (Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]).some((key) => criteria[key] !== DEFAULTS[key]),
      set: (patch) => void setQuery(patch),
      reset: () => void setQuery(DEFAULTS),
    };
  }, [query, setQuery, listings]);

  return <MobileMarketContext.Provider value={value}>{children}</MobileMarketContext.Provider>;
}

export function useMobileMarket() {
  const state = useContext(MobileMarketContext);
  if (!state) throw new Error("useMobileMarket must be used inside <MobileMarketProvider>.");
  return state;
}
