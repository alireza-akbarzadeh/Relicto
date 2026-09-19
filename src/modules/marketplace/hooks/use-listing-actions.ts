"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import type { Listing } from "../types";

/** Mock order id, stable per listing so the tracking link is predictable in the demo. */
const orderIdFor = (listing: Listing) => `LT-${88_000 + listing.name.length * 37}`;

export function useListingActions(listing: Listing) {
  const router = useRouter();

  const viewOffers = () => router.push(`/items/${listing.id}`);

  const quickBuy = () => {
    const orderId = orderIdFor(listing);
    toast.success(`Order ${orderId} placed`, {
      description: `${listing.name} · ${formatMoney(listing.priceUsd)} held in escrow while the seller's bot sends the trade.`,
      action: { label: "Track", onClick: () => router.push(`/orders/${orderId}`) },
    });
  };

  return { viewOffers, quickBuy };
}
