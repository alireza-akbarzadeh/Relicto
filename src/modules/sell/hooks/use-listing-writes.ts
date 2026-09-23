"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { delistListing, listInventoryItem } from "../actions/listings";

const LIST_REFUSED = {
  "not-found": ["That item isn't in your inventory", "Refresh the studio and pick it again."],
  "already-listed": ["It's already on the market", "Delist it first to change the listing."],
  "not-in-catalog": ["This item isn't in the Relicto catalog yet", "It can be listed once the catalog carries it."],
} as const;

const failed = () => toast.error("Couldn't reach the market", { description: "Check your connection and try again." });

/** The studio's two writes: put an inventory item on the market, or pull a listing back. */
export function useListingWrites() {
  const [pending, startTransition] = useTransition();

  const list = (item: { id: string; name: string }, priceUsd: number, note: string) => {
    if (!(priceUsd > 0)) return toast.error("Set an ask price above $0");
    startTransition(async () => {
      try {
        const { status } = await listInventoryItem({ inventoryId: item.id, priceUsd, note });
        if (status === "listed") {
          toast.success(`${item.name} is live`, { description: `Listed at ${formatMoney(priceUsd)}. Buyers see it on the marketplace now.` });
        } else {
          toast.error(LIST_REFUSED[status][0], { description: LIST_REFUSED[status][1] });
        }
      } catch {
        failed();
      }
    });
  };

  const delist = (listingId: string, name: string) =>
    startTransition(async () => {
      try {
        const { ok } = await delistListing({ listingId });
        if (ok) toast(`${name} delisted to inventory`);
        else toast.error(`${name} can't be delisted`, { description: "It's reserved in a buyer's escrow or already sold." });
      } catch {
        failed();
      }
    });

  return { pending, list, delist };
}
