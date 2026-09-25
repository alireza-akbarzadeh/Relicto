"use client";

import { LinkButton } from "@/components/ui/link-button";
import { Icon } from "@/components/ui/icon";
import { optimisticLine } from "@/modules/checkout/lib/optimistic-line";
import { useCart } from "@/modules/relicto/state/cart-provider";
import type { WatchedItem } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { WatchedCard } from "./watched-card";

/** Nothing watched yet — point at the catalog rather than showing an empty grid. */
function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center gap-space-sm rounded-xl bg-surface-card px-space-lg py-space-xl text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low text-text-muted">
        <Icon name="favorite" className="text-[28px]" />
      </div>
      <span className="font-headline-sm text-headline-sm font-bold text-text-primary">Nothing on your watchlist</span>
      <p className="max-w-sm font-body-sm text-body-sm text-text-muted">
        Tap the heart on any listing to track its floor here. Watched items also appear on your tracker board.
      </p>
      <LinkButton href="/marketplace" className="mt-space-xs">
        Browse the marketplace
      </LinkButton>
    </div>
  );
}

/**
 * The trader's watched items. Private to them — this is buying intent, so it
 * is never shown on someone else's profile.
 */
export function WatchlistSection({ items }: { items: WatchedItem[] }) {
  const { addItem } = useCart();

  const buy = (item: WatchedItem) => {
    if (!item.listingId || item.floorUsd === null) return;
    addItem(
      optimisticLine({
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle,
        image: item.image,
        imageAlt: item.imageAlt,
        gameLabel: item.gameLabel,
        rarityLabel: item.rarityLabel,
        priceUsd: item.floorUsd,
        listingId: item.listingId,
      }),
      /* Reserve that exact copy — the cheapest one the floor quotes. */
      item.listingId,
    );
  };

  return (
    <div className="flex flex-col gap-space-md">
      <SectionTitle
        tone="crimson"
        title={`Watchlist (${items.length})`}
        subtitle="Items you're tracking. Only you can see this — prices are the cheapest copy on sale now."
      />
      {items.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-2">
          {items.map((item) => (
            <WatchedCard key={item.slug} item={item} onBuy={buy} />
          ))}
        </div>
      )}
    </div>
  );
}
