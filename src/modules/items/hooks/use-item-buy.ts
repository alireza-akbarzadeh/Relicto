"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { optimisticLine } from "@/modules/checkout/lib/optimistic-line";
import { useCart } from "@/modules/relicto/state/cart-provider";
import type { ItemDetail, Offer } from "../types";

/**
 * The desktop item page's buy actions. Every one reserves a real copy: a
 * seller-book row reserves that listing, Instant Buy the cheapest one. A row
 * with no listing behind it (an authored sample) falls back to the slug, which
 * the server resolves to the cheapest copy from another seller.
 */
export function useItemBuy(item: ItemDetail) {
  const router = useRouter();
  const { has, addItem } = useCart();
  const [pending, setPending] = useState(false);
  const floor: Offer | undefined = item.offers[0];

  const lineFor = (offer: Offer) =>
    optimisticLine({
      slug: item.slug,
      name: item.name,
      subtitle: [item.eyebrow.hero, item.eyebrow.slot].filter((part) => part && part !== "—").join(" • "),
      image: item.hero.image,
      imageAlt: item.hero.imageAlt,
      gameLabel: item.eyebrow.game,
      rarityLabel: item.badges[0]?.label,
      priceUsd: offer.priceUsd,
      listingId: offer.listingId,
    });

  const refFor = (offer: Offer) => offer.listingId ?? item.slug;
  const inBasket = (offer: Offer) => has(refFor(offer)) || has(item.slug);

  /** Reserve the copy and go straight to settlement. */
  const buyNow = async (offer: Offer | undefined = floor) => {
    if (!offer) return toast(`No one is selling ${item.name} right now`, { description: "Watch it to hear when a copy is listed." });
    if (!inBasket(offer)) {
      setPending(true);
      const added = await addItem(lineFor(offer), refFor(offer));
      setPending(false);
      if (!added) return;
    }
    router.push("/checkout");
  };

  /** Reserve the copy and stay on the page. */
  const addToBasket = (offer: Offer | undefined = floor) => {
    if (!offer) return toast(`No one is selling ${item.name} right now`);
    if (inBasket(offer)) {
      return toast(`${item.name} is already in your basket`, { action: { label: "Checkout", onClick: () => router.push("/checkout") } });
    }
    void addItem(lineFor(offer), refFor(offer));
    toast.success(`${item.name} added to your basket`, {
      description: `${formatMoney(offer.priceUsd)} from ${offer.seller.name}, reserved for escrow checkout.`,
      action: { label: "Checkout", onClick: () => router.push("/checkout") },
    });
  };

  return { floor, pending, buyNow, addToBasket, inBasket };
}
