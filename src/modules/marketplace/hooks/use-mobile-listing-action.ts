"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CheckoutItem } from "@/modules/checkout/types";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { formatMoney } from "@/lib/format";
import type { MobileListing } from "../mobile.types";

function toCheckoutItem(listing: MobileListing): CheckoutItem {
  return {
    id: listing.slug,
    image: listing.image,
    imageAlt: listing.imageAlt,
    badge: listing.tag,
    badgeTone: "bg-primary-container text-on-primary-container",
    game: listing.game === "dota2" ? "Dota 2" : "CS2",
    gameTone: listing.game === "cs2" ? "text-tertiary" : "text-secondary",
    name: listing.name,
    detail: `${listing.subtitle} • ${listing.chip}`,
    intel: [],
    bot: "Sentinel Bot #42",
    price: listing.priceUsd,
    marker: listing.chip,
    markerTone: "text-status-upcoming",
  };
}

/** The card's action: escrow adds to the basket, trade adds and opens checkout, inspect opens the item. */
export function useMobileListingAction(listing: MobileListing) {
  const router = useRouter();
  const { has, addItem } = useCart();

  const reserve = () => {
    if (has(listing.slug)) return false;
    addItem(toCheckoutItem(listing), listing.slug);
    return true;
  };

  return () => {
    if (listing.action === "inspect") {
      router.push(`/items/${listing.slug}`);
      return;
    }
    const added = reserve();
    if (listing.action === "trade") {
      router.push("/checkout");
      return;
    }
    toast.success(added ? `${listing.name} reserved in escrow` : `${listing.name} is already in your basket`, {
      description: `${formatMoney(listing.priceUsd)} held by a Sentinel bot until you check out.`,
      action: { label: "Checkout", onClick: () => router.push("/checkout") },
    });
  };
}
