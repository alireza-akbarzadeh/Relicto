"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { selectRows, type GameFilter, type LedgerTab, type RangeFilter } from "../lib/history-filters";
import { ledgerSearchParams } from "../lib/search-params";
import type { LedgerRow } from "../types";

/**
 * Tab, game, range, search and page for the trade ledger. Everything lives in
 * the URL, so a filtered ledger can be shared, bookmarked and reloaded.
 */
export function useOrderFilters(rows: LedgerRow[]) {
  const [query, setQuery] = useQueryStates(ledgerSearchParams, { history: "replace", shallow: true, clearOnDefault: true });

  const visible = useMemo(() => selectRows(rows, query.tab, query.game, query.q), [rows, query.tab, query.game, query.q]);

  return {
    tab: query.tab,
    setTab: (tab: LedgerTab) => void setQuery({ tab, page: 1 }),
    game: query.game,
    setGame: (game: GameFilter) => void setQuery({ game, page: 1 }),
    range: query.range,
    setRange: (range: RangeFilter) => void setQuery({ range, page: 1 }),
    query: query.q,
    setQuery: (q: string) => void setQuery({ q, page: 1 }),
    page: query.page,
    setPage: (page: number) => void setQuery({ page }),
    visible,
  };
}
