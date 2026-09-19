"use client";

import { createSelectionContext } from "@/lib/create-selection-context";
import type { GameFilter, GameId } from "../types";

// Named exports only: server components can render a client export but can't
// reach into properties of one (e.g. `Featured.Provider`).

/** Desktop: the game shown in the hero, driven by the header pills and hero tabs. */
const featuredGame = createSelectionContext<GameId>("FeaturedGame");
export const FeaturedGameProvider = featuredGame.Provider;
export const useFeaturedGame = featuredGame.useSelection;

/** Mobile: the "All Arenas / Dota 2 / CS2" tabs that filter the bracket list. */
const mobileGameFilter = createSelectionContext<GameFilter>("MobileGameFilter");
export const MobileGameFilterProvider = mobileGameFilter.Provider;
export const useMobileGameFilter = mobileGameFilter.useSelection;
