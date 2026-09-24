"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQueryStates } from "nuqs";
import { EMPTY_FILTERS } from "../lib/filters";
import { gameReset, marketplaceSearchParams, toFilters, toQuery } from "../lib/search-params";
import type { EcosystemFilter, Filters, MarketplaceResults } from "../types";

type MarketplaceState = {
  filters: Filters;
  results: MarketplaceResults;
  /** Merge criteria; any change other than paging returns to page 1. */
  patch: (next: Partial<Filters>) => void;
  /** Switching economies also drops the other game's facets. */
  setGame: (game: EcosystemFilter) => void;
  resetAll: () => void;
};

const MarketplaceContext = createContext<MarketplaceState | null>(null);

/**
 * Every search criterion lives in the URL (nuqs), so a filtered catalog can be
 * shared, bookmarked and restored on reload. `shallow: false` is the point:
 * a criterion change re-runs the page's server component, which re-queries
 * Postgres — the browser never holds the catalog. The watchlist is app-wide
 * (`useWatchlist`), not marketplace state.
 */
export function MarketplaceProvider({ results, children }: { results: MarketplaceResults; children: ReactNode }) {
  const [query, setQuery] = useQueryStates(marketplaceSearchParams, { history: "replace", shallow: false, clearOnDefault: true });

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

  const value = useMemo(
    () => ({ filters, results, patch, setGame, resetAll }),
    [filters, results, patch, setGame, resetAll],
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const state = useContext(MarketplaceContext);
  if (!state) throw new Error("useMarketplace must be used inside <MarketplaceProvider>.");
  return state;
}
