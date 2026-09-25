"use client";

import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { ACCENT_TEXT, CARD_BLOB, RARITY_BADGE } from "../../lib/tones";
import type { Listing } from "../../types";
import { useListingActions } from "../../hooks/use-listing-actions";
import { ListingMedia } from "./listing-media";
import { PriceDelta } from "./price-delta";
import { WishlistButton } from "./wishlist-button";
import { ShareButton } from "@/modules/relicto/components/share-button";

export function ListingCard({ listing, priority }: { listing: Listing; priority?: boolean }) {
  const { viewOffers, quickBuy, inBasket } = useListingActions(listing);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-card p-space-md shadow-md transition-all duration-200 hover:bg-surface-container">
      <div className={cn("pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl transition-all", CARD_BLOB[listing.glow.blob])} />
      <div>
        <div className="mb-space-xs flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={cn("rounded px-2 py-0.5 font-label-badge text-label-badge font-bold tracking-wider uppercase", RARITY_BADGE[listing.badge.style])}>
              {listing.badge.label}
            </span>
            <span
              className={cn(
                "rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-badge text-[10px] uppercase",
                ACCENT_TEXT[listing.tag.accent],
                listing.tag.bold && "font-bold",
              )}
            >
              {listing.tag.label}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <ShareButton title={listing.name} text={listing.subtitle} path={`/items/${listing.id}`} />
            <WishlistButton listing={listing} />
          </div>
        </div>
        <ListingMedia listing={listing} priority={priority} />
        <div className="mb-space-xs">
          <h4 className="truncate font-headline-sm text-headline-sm font-bold text-text-primary transition-colors group-hover:text-primary">
            {listing.name}
          </h4>
          <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-text-muted">
            <span>{listing.subtitle}</span>
            <span>·</span>
            <span className={ACCENT_TEXT[listing.detail.accent]}>{listing.detail.label}</span>
          </div>
        </div>
        <div className="mb-space-sm space-y-1 rounded-lg bg-surface-container-lowest/80 p-space-xs">
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-headline-md font-bold text-tertiary">{formatMoney(listing.priceUsd)}</span>
            <PriceDelta percent={listing.change.percent} window={listing.change.window} />
          </div>
          <div className="flex items-center justify-between font-data-mono-md text-[11px] text-text-muted">
            <span>{listing.meta[0]}</span>
            <span>{listing.meta[1]}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={viewOffers}
          className="flex w-full items-center justify-center gap-1 rounded bg-surface-container-high px-space-sm py-2 font-headline-sm text-[13px] font-bold text-text-primary uppercase transition-colors hover:bg-surface-bright"
        >
          <span>View Offers</span>
          <span className="font-data-mono-md text-data-mono-md text-text-secondary">({listing.offers})</span>
        </button>
        <button
          type="button"
          onClick={quickBuy}
          className={cn(
            "w-full rounded px-space-sm py-2 font-headline-sm text-[13px] font-bold uppercase shadow-xs transition-all",
            inBasket
              ? "cursor-default bg-status-upcoming/20 text-status-upcoming"
              : "bg-primary-container text-on-primary-container hover:bg-primary",
          )}
        >
          {inBasket ? "In Basket" : "Quick Buy Now"}
        </button>
      </div>
    </div>
  );
}
