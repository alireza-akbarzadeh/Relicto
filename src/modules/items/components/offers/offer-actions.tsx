"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { OfferDialog } from "@/modules/offers/components/offer-dialog";
import type { Offer } from "../../types";

type OfferActionsProps = {
  offer: Offer;
  itemName: string;
  onBuy: (offer: Offer) => void;
  onAdd: (offer: Offer) => void;
};

/** A seller-book row's trade column: buy the copy, basket it, or bid on it. */
export function OfferActions({ offer, itemName, onBuy, onAdd }: OfferActionsProps) {
  const [bidding, setBidding] = useState(false);
  const { listingId, myBid } = offer;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={null}
          size={null}
          onClick={() => onBuy(offer)}
          className={cn(
            "h-auto rounded border-0 px-4 py-2 font-label-caps text-xs font-bold transition-all",
            offer.best
              ? "bg-tertiary text-on-tertiary-container shadow-sm hover:bg-tertiary-fixed hover:shadow-md"
              : "border border-border-subtle bg-surface-container text-text-primary hover:bg-tertiary hover:text-on-tertiary-container",
          )}
        >
          BUY NOW
        </Button>
        <Button
          variant={null}
          size={null}
          onClick={() => onAdd(offer)}
          aria-label={`Add ${offer.seller.name}'s copy to cart`}
          className="h-auto rounded border border-border-subtle bg-surface-container p-2 text-text-secondary transition-all hover:bg-surface-container-high hover:text-text-primary"
        >
          <Icon name="add_shopping_cart" className="text-[18px]" />
        </Button>
        {/* Authored sample rows have no copy behind them to bid on. */}
        {listingId && (
          <Button
            variant={null}
            size={null}
            onClick={() => setBidding(true)}
            aria-label={myBid ? `Revise your offer to ${offer.seller.name}` : `Make ${offer.seller.name} an offer`}
            className={cn(
              "h-auto rounded border p-2 transition-all hover:bg-surface-container-high",
              myBid ? "border-tertiary/40 bg-surface-container-high text-tertiary" : "border-border-subtle bg-surface-container text-text-secondary hover:text-tertiary",
            )}
          >
            <Icon name="sell" className="text-[18px]" />
          </Button>
        )}
      </div>
      {myBid && (
        <span className="font-data-mono-md text-[10px] text-tertiary">
          Your offer {formatMoney(myBid.priceUsd)} · {myBid.expires}
        </span>
      )}
      {listingId && (
        <OfferDialog
          open={bidding}
          onOpenChange={setBidding}
          listingId={listingId}
          itemName={itemName}
          sellerName={offer.seller.name}
          askUsd={offer.priceUsd}
          myBid={myBid}
        />
      )}
    </div>
  );
}
