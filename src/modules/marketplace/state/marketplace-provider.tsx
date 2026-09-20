"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQueryStates } from "nuqs";
import { EMPTY_FILTERS, searchListings, toggle, type ListingResults } from "../lib/filters";
import { gameReset, marketplaceSearchParams, toFilters, toQuery } from "../lib/search-params";
import type { EcosystemFilter, Filters, Listing } from "../types";

type MarketplaceState = {
  filters: Filters;
  results: ListingResults;
  /** Merge criteria; any change other than paging returns to page 1. */
  patch: (next: Partial<Filters>) => void;
  /** Switching economies also drops the other game's facets. */
  setGame: (game: EcosystemFilter) => void;
  resetAll: () => void;
  wishlist: Set<string>;
  toggleWishlist: (id: string) => void;
};

const MarketplaceContext = createContext<MarketplaceState | null>(null);

/**
 * Every search criterion lives in the URL (nuqs), so a filtered catalog can be
 * shared, bookmarked and restored on reload. Only the wishlist stays local.
 */
export function MarketplaceProvider({ catalog, children }: { catalog: Listing[]; children: ReactNode }) {
  const [query, setQuery] = useQueryStates(marketplaceSearchParams, { history: "replace", shallow: true, clearOnDefault: true });
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  const filters = useMemo(() => toFilters(query), [query]);

  const patch = useCallback(
    (next: Partial<Filters>) => {
      void setQuery({ ...toQuery(next), page: next.page ?? 1 });
    },
    [setQuery],
  );

  const setGame = useCallback(
    (game: EcosystemFilter) => {
      void setQuery({ ...gameReset(game), page: 1 });
    },
    [setQuery],
  );

  const resetAll = useCallback(() => {
    void setQuery({ ...toQuery(EMPTY_FILTERS), q: "", page: 1 });
  }, [setQuery]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((current) => new Set(toggle([...current], id)));
  }, []);

  const results = useMemo(() => searchListings(catalog, filters), [catalog, filters]);
  const value = useMemo(
    () => ({ filters, results, patch, setGame, resetAll, wishlist, toggleWishlist }),
    [filters, results, patch, setGame, resetAll, wishlist, toggleWishlist],
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const state = useContext(MarketplaceContext);
  if (!state) throw new Error("useMarketplace must be used inside <MarketplaceProvider>.");
  return state;
}
