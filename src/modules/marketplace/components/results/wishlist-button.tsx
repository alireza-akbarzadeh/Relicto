"use client";

import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useMarketplace } from "../../state/marketplace-provider";
import type { Listing } from "../../types";

export function WishlistButton({ listing }: { listing: Listing }) {
  const { wishlist, toggleWishlist } = useMarketplace();
  const saved = wishlist.has(listing.id);

  const onClick = () => {
    toggleWishlist(listing.id);
    if (saved) toast(`Removed ${listing.name} from your watchlist`);
    else toast.success(`Watching ${listing.name}`, { description: "We'll alert you when the floor moves ±5%." });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
      className={cn("p-1 transition-colors hover:text-primary", saved ? "text-primary" : "text-text-muted")}
    >
      <Icon name="favorite" filled={saved} className="text-[18px]" />
    </button>
  );
}
