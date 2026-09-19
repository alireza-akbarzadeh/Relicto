"use client";

import { cn } from "@/lib/cn";
import { useMarketplace } from "../../state/marketplace-provider";
import { ListingCard } from "./listing-card";

/** Grid view: four columns; compact view: two (per the design's view switch). */
const LAYOUT = {
  grid: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg",
  list: "grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg",
} as const;

export function ListingGrid() {
  const { filters, results, resetAll } = useMarketplace();

  if (!results.items.length) {
    return (
      <div className="mb-space-lg flex flex-col items-center gap-2 rounded-xl bg-surface-card px-space-md py-space-xl text-center shadow-md">
        <span className="font-headline-sm text-headline-sm text-text-primary uppercase">No drops match these criteria</span>
        <p className="max-w-md font-body-sm text-body-sm text-text-muted">
          Loosen the price band, remove a rarity, or clear the search to see more listings.
        </p>
        <button
          type="button"
          onClick={resetAll}
          className="mt-2 rounded bg-surface-container-high px-space-md py-2 font-label-caps text-label-caps text-text-primary uppercase hover:bg-surface-bright"
        >
          Reset all filters
        </button>
      </div>
    );
  }

  return (
    <div className={cn(LAYOUT[filters.view])}>
      {results.items.map((listing, i) => (
        <ListingCard key={listing.id} listing={listing} priority={i < 4} />
      ))}
    </div>
  );
}
