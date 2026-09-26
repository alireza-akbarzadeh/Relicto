"use client";

import { useEffect, useState } from "react";
import type { SearchGame, SearchResults } from "../types";

export type SearchCriteria = {
  q: string;
  game: SearchGame;
  rarity: string | null;
  /** The "Float < 0.05 (FN)" chip narrows to Factory New copies. */
  fnOnly: boolean;
  /** The price chip: copies from $50 up. */
  fiftyPlus: boolean;
};

export const EMPTY_CRITERIA: SearchCriteria = {
  q: "",
  game: "all",
  rarity: null,
  fnOnly: false,
  fiftyPlus: false,
};

/** Typing settles for this long before a request goes out. */
const DEBOUNCE_MS = 180;

function toQuery(criteria: SearchCriteria) {
  const params = new URLSearchParams();
  if (criteria.q.trim()) params.set("q", criteria.q.trim());
  if (criteria.game !== "all") params.set("game", criteria.game);
  if (criteria.rarity) params.set("rarity", criteria.rarity);
  if (criteria.fnOnly) params.set("wear", "fn");
  if (criteria.fiftyPlus) params.set("min", "50");
  return params.toString();
}

/**
 * Debounced `GET /api/search`. Each new criteria aborts the request before
 * it, so a slow answer to "dop" can never overwrite the answer to "doppler".
 */
export function useSearchResults(criteria: SearchCriteria, enabled: boolean) {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const query = toQuery(criteria);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?${query}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(String(response.status));
        setResults((await response.json()) as SearchResults);
        setFailed(false);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, enabled]);

  return { results, loading, failed };
}
