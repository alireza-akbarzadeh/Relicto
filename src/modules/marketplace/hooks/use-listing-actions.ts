"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { formatMoney } from "@/lib/format";
import type { CheckoutItem } from "@/modules/checkout/types";
import type { Listing } from "../types";

/** The optimistic line shown until the server answers with the reserved copy. */
function checkoutItemFromListing(listing: Listing): CheckoutItem {
  return {
    id: listing.listingId ?? listing.id,
    listingId: listing.listingId,
    slug: listing.id,
    image: listing.image,
    imageAlt: listing.imageAlt,
    badge: listing.badge.label,
    badgeTone: "bg-primary-container text-on-primary-container",
    game: listing.game === "dota2" ? "Dota 2" : listing.game.toUpperCase(),
    gameTone: listing.game === "cs2" ? "text-tertiary" : "text-secondary",
    name: listing.name,
    detail: `${listing.subtitle} • ${listing.detail.label}`,
    intel: listing.meta,
    bot: "Sentinel Bot #42",
    price: listing.priceUsd,
    marker: listing.detail.label,
    markerTone: "text-status-upcoming",
  };
}

export function useListingActions(listing: Listing) {
  const router = useRouter();
  const { has, addItem } = useCart();
  // The exact copy on the card when the catalog is live; otherwise its cheapest copy.
  const ref = listing.listingId ?? listing.id;
  const inBasket = has(ref);

  const viewOffers = () => router.push(`/items/${listing.id}`);

  const quickBuy = () => {
    if (inBasket) {
      toast(`${listing.name} is already in your basket`, { description: "Open the basket to continue to checkout." });
      return;
    }
    addItem(checkoutItemFromListing(listing), ref);
    toast.success(`${listing.name} added to basket`, {
      description: `${formatMoney(listing.priceUsd)} reserved for secure escrow checkout.`,
      action: { label: "Checkout", onClick: () => router.push("/checkout") },
    });
  };

  return { viewOffers, quickBuy, inBasket };
}
