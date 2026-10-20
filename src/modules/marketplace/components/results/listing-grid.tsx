"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ItemQuickPickDialog } from "@/modules/items/components/quick-pick/item-quick-pick-dialog";
import { useMarketplace } from "../../state/marketplace-provider";
import type { Listing } from "../../types";
import { ListingCard } from "./listing-card";

/** Grid view: four columns; compact view: two (per the design's view switch). */
const LAYOUT = {
  grid: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md mb-space-lg",
  list: "grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg",
} as const;

export function ListingGrid() {
  const { filters, results, resetAll } = useMarketplace();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  if (!results.items.length) {
    return (
      <div className="mb-space-lg flex flex-col items-center gap-2 rounded-xl bg-surface-card px-space-md py-space-xl text-center shadow-md">
        <span className="font-headline-sm text-headline-sm text-text-primary uppercase">
          No drops match these criteria
        </span>
        <p className="max-w-md font-body-sm text-body-sm text-text-muted">
          Loosen the price band, remove a rarity, or clear the search to see more listings.
        </p>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={resetAll}
          className="mt-2 rounded bg-surface-container-high px-space-md py-2 font-label-caps text-label-caps text-text-primary uppercase hover:bg-surface-bright"
        >
          Reset all filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={cn(LAYOUT[filters.view])}>
        {results.items.map((listing, i) => (
          <ListingCard
            key={listing.listingId ?? listing.id}
            listing={listing}
            priority={i < 4}
            onQuickPick={() => setSelectedListing(listing)}
          />
        ))}
      </div>

      <ItemQuickPickDialog
        open={Boolean(selectedListing)}
        onOpenChange={(open) => {
          if (!open) setSelectedListing(null);
        }}
        slug={selectedListing?.id ?? null}
        initialListing={selectedListing}
      />
    </>
  );
}
