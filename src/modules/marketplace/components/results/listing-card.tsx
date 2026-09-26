"use client";

import { ShareButton } from "@/modules/relicto/components/share-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useListingActions } from "../../hooks/use-listing-actions";
import { ACCENT_TEXT, CARD_BLOB, RARITY_BADGE } from "../../lib/tones";
import type { Listing } from "../../types";
import { ListingMedia } from "./listing-media";
import { PriceDelta } from "./price-delta";
import { WishlistButton } from "./wishlist-button";

export function ListingCard({
  listing,
  priority,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  const { viewOffers, quickBuy, inBasket } = useListingActions(listing);

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl",
        "border border-outline-variant/30 bg-surface-card",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/25 hover:bg-surface-container",
        "hover:shadow-lg",
      )}
    >
      {/* Ambient glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 z-0 h-40 w-40 rounded-full",
          "blur-3xl opacity-50 transition-opacity duration-300",
          "group-hover:opacity-80",
          CARD_BLOB[listing.glow.blob],
        )}
      />

      {/* Top content */}
      <div className="relative z-10 flex flex-1 flex-col p-space-md">
        {/* Header */}
        <div className="mb-space-sm flex min-h-6 items-center justify-between gap-space-sm">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-1",
                "font-label-badge text-label-badge font-bold tracking-wider uppercase",
                RARITY_BADGE[listing.badge.style],
              )}
            >
              {listing.badge.label}
            </span>

            <span
              className={cn(
                "min-w-0 truncate rounded-md",
                "bg-surface-container-lowest px-2 py-1",
                "font-label-badge text-[10px] tracking-wide uppercase",
                ACCENT_TEXT[listing.tag.accent],
                listing.tag.bold && "font-bold",
              )}
            >
              {listing.tag.label}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
            <ShareButton
              title={listing.name}
              text={listing.subtitle}
              path={`/items/${listing.id}`}
            />
            <WishlistButton listing={listing} />
          </div>
        </div>

        {/* Item media */}
        <div className="relative mb-space-md overflow-hidden rounded-xl">
          <ListingMedia listing={listing} priority={priority} />

          {/* Bottom media fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-surface-card/40 to-transparent" />
        </div>

        {/* Item information */}
        <div className="mb-space-md min-w-0">
          <h4
            className={cn(
              "truncate",
              "font-headline-sm text-headline-sm font-bold text-text-primary",
              "transition-colors duration-200 group-hover:text-primary",
            )}
          >
            {listing.name}
          </h4>

          <div className="mt-1 flex min-w-0 items-center gap-1.5 font-body-sm text-body-sm text-text-muted">
            <span className="truncate">{listing.subtitle}</span>

            <span className="shrink-0 text-text-muted/50">•</span>

            <span
              className={cn(
                "shrink-0",
                ACCENT_TEXT[listing.detail.accent],
              )}
            >
              {listing.detail.label}
            </span>
          </div>
        </div>

        {/* Price panel */}
        <div
          className={cn(
            "mt-auto rounded-xl p-space-sm",
            "border border-outline-variant/20",
            "bg-surface-container-lowest/70",
          )}
        >
          <div className="flex items-end justify-between gap-space-sm">
            <div className="min-w-0">
              <span className="mb-0.5 block font-label-badge text-[9px] font-semibold tracking-widest text-text-muted uppercase">
                Current Price
              </span>

              <span className="block truncate font-headline-md text-headline-md font-bold text-tertiary">
                {formatMoney(listing.priceUsd)}
              </span>
            </div>

            <PriceDelta
              percent={listing.change.percent}
              window={listing.change.window}
            />
          </div>

          <div className="mt-space-xs flex items-center justify-between border-t border-outline-variant/15 pt-space-xs font-data-mono-md text-[10px] text-text-muted">
            <span>{listing.meta[0]}</span>
            <span>{listing.meta[1]}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 grid grid-cols-[1fr_1.15fr] gap-2 border-t border-outline-variant/20 bg-surface-container-low/40 p-space-md">
        <button
          type="button"
          onClick={viewOffers}
          className={cn(
            "flex min-w-0 items-center justify-center gap-1.5 rounded-lg",
            "border border-outline-variant/30 bg-surface-container-high",
            "px-space-sm py-2.5",
            "font-headline-sm text-[12px] font-bold text-text-primary uppercase",
            "transition-all duration-200",
            "hover:border-outline-variant/50 hover:bg-surface-bright",
          )}
        >
          <span>Offers</span>
          <span className="font-data-mono-md text-[11px] text-text-secondary">
            {listing.offers}
          </span>
        </button>

        <button
          type="button"
          onClick={quickBuy}
          className={cn(
            "rounded-lg px-space-sm py-2.5",
            "font-headline-sm text-[12px] font-bold uppercase",
            "transition-all duration-200",
            "shadow-xs",
            inBasket
              ? "cursor-default bg-status-upcoming/15 text-status-upcoming"
              : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary",
          )}
        >
          {inBasket ? "In Basket" : "Quick Buy"}
        </button>
      </div>
    </article>
  );
}

