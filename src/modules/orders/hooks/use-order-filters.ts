"use client";

import { useMemo, useState } from "react";
import { selectRows, type GameFilter, type LedgerTab, type RangeFilter } from "../lib/history-filters";
import type { LedgerRow } from "../types";

/** Tab, game, range and search state for the trade ledger table. */
export function useOrderFilters(rows: LedgerRow[]) {
  const [tab, setTab] = useState<LedgerTab>("all");
  const [game, setGame] = useState<GameFilter>("ALL");
  const [range, setRange] = useState<RangeFilter>("30d");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => selectRows(rows, tab, game, query), [rows, tab, game, query]);
  return { tab, setTab, game, setGame, range, setRange, query, setQuery, visible };
}
