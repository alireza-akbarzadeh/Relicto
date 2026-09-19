"use client";

import { useMemo, useState } from "react";
import { filterByGame } from "../lib/filter";
import type { GameFilter, GameId } from "../types";

/** Local "All / Dota 2 / CS2" filter over any list of game-tagged items. */
export function useGameFilter<T extends { game: GameId }>(items: T[], initial: GameFilter = "all") {
  const [filter, setFilter] = useState<GameFilter>(initial);
  const visible = useMemo(() => filterByGame(items, filter), [items, filter]);
  return { filter, setFilter, visible };
}
