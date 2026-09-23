"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useWatchlist } from "@/modules/relicto/state/watchlist-provider";
import type { Listing } from "../../types";

/** The card's heart: watching an item puts it on the trader's tracker board. */
export function WishlistButton({ listing }: { listing: Listing }) {
  const { isWatched, toggle } = useWatchlist();
  const saved = isWatched(listing.id);

  return (
    <Button
      variant={null}
      size={null}
      onClick={() => toggle(listing.id, listing.name)}
      aria-pressed={saved}
      title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
      className={cn("h-auto rounded-none border-0 p-1 transition-colors hover:text-primary", saved ? "text-primary" : "text-text-muted")}
    >
      <Icon name="favorite" filled={saved} className="text-[18px]" />
    </Button>
  );
}
