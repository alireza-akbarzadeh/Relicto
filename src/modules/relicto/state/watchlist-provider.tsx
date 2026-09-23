"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useWatchlistState } from "../hooks/use-watchlist-state";

type WatchlistState = ReturnType<typeof useWatchlistState>;

const WatchlistContext = createContext<WatchlistState | null>(null);

/** The signed-in trader's watchlist, seeded from the server render. */
export function WatchlistProvider({ initialSlugs, children }: { initialSlugs: string[]; children: ReactNode }) {
  return <WatchlistContext.Provider value={useWatchlistState(initialSlugs)}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const watchlist = useContext(WatchlistContext);
  if (!watchlist) throw new Error("useWatchlist must be used inside <WatchlistProvider>.");
  return watchlist;
}
