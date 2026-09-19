"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_FILTERS, EMPTY_FILTERS, searchListings, toggle, type ListingResults } from "../lib/filters";
import type { Filters, Listing } from "../types";

type MarketplaceState = {
  filters: Filters;
  results: ListingResults;
  /** Merge criteria; any change other than paging returns to page 1. */
  patch: (next: Partial<Filters>) => void;
  resetAll: () => void;
  wishlist: Set<string>;
  toggleWishlist: (id: string) => void;
};

const MarketplaceContext = createContext<MarketplaceState | null>(null);

type ProviderProps = { catalog: Listing[]; initialQuery?: string; children: ReactNode };

/** Key this by the URL query so a new header search starts a fresh search. */
export function MarketplaceProvider({ catalog, initialQuery = "", children }: ProviderProps) {
  const [filters, setFilters] = useState<Filters>(() => ({ ...DEFAULT_FILTERS, query: initialQuery }));
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  const patch = useCallback((next: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...next, page: next.page ?? 1 }));
  }, []);

  const resetAll = useCallback(() => setFilters({ ...EMPTY_FILTERS }), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((current) => new Set(toggle([...current], id)));
  }, []);

  const results = useMemo(() => searchListings(catalog, filters), [catalog, filters]);
  const value = useMemo(
    () => ({ filters, results, patch, resetAll, wishlist, toggleWishlist }),
    [filters, results, patch, resetAll, wishlist, toggleWishlist],
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const state = useContext(MarketplaceContext);
  if (!state) throw new Error("useMarketplace must be used inside <MarketplaceProvider>.");
  return state;
}
