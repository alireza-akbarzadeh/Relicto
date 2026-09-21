"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useMobileMarket } from "../../state/mobile-market-provider";
import { MobileListingCard } from "./mobile-listing-card";

/** Filtered listings: two columns in dense view, one in list view, recovery state when empty. */
export function MobileListingGrid() {
  const { results, view, reset } = useMobileMarket();

  if (results.length === 0) {
    return (
      <section className="flex flex-col items-center gap-space-sm rounded-xl bg-surface-container px-space-md py-space-xl text-center">
        <Icon name="search_off" className="text-[32px] text-text-muted" />
        <span className="font-headline-sm text-headline-sm text-text-primary">No listings match</span>
        <span className="font-body-sm text-body-sm text-text-secondary">Widen the price band or clear a filter to see the live book.</span>
        <Button
          variant={null}
          size={null}
          onClick={reset}
          className="mt-1 h-9 rounded-lg border-0 bg-primary px-4 font-label-caps text-label-caps font-bold text-on-primary uppercase"
        >
          Reset filters
        </Button>
      </section>
    );
  }

  return (
    <section className={cn("grid w-full gap-space-sm", view === "list" ? "grid-cols-1" : "grid-cols-2")}>
      {results.map((listing) => (
        <MobileListingCard key={listing.slug} listing={listing} />
      ))}
    </section>
  );
}
