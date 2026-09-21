"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CheckoutItem } from "@/modules/checkout/types";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { formatMoney } from "@/lib/format";
import type { ItemMobile, MobileSeller, SynergyItem } from "../mobile.types";

function sellerLine(item: ItemMobile, seller: MobileSeller): CheckoutItem {
  return {
    id: item.cartId,
    image: item.image,
    imageAlt: item.imageAlt,
    badge: item.rarity,
    badgeTone: "bg-primary-container text-on-primary-container",
    game: item.game,
    gameTone: "text-secondary",
    name: item.name,
    detail: `${item.eyebrow} • ${seller.tags.map((tag) => tag.label).join(" • ")}`,
    intel: [`Vendor: ${seller.name} (${seller.trust.split(" · ")[0]})`],
    bot: seller.instant ? "Sentinel Bot #42" : "Direct P2P",
    price: seller.priceUsd,
    marker: seller.tags[0]?.label ?? item.tier,
    markerTone: "text-text-primary",
  };
}

function synergyLine(item: ItemMobile, entry: SynergyItem, discountPct = 0): CheckoutItem {
  const price = (entry.priceUsd ?? 0) * (1 - discountPct / 100);
  return {
    id: entry.id,
    image: entry.image,
    imageAlt: entry.imageAlt,
    badge: entry.tag,
    badgeTone: "bg-primary-container text-on-primary-container",
    game: item.game,
    gameTone: "text-secondary",
    name: entry.name,
    detail: `${item.synergy.title}${discountPct ? ` • Combo -${discountPct}%` : ""}`,
    intel: [],
    bot: "Sentinel Bot #42",
    price,
    marker: entry.tag,
    markerTone: "text-text-primary",
  };
}

/** Basket actions of the mobile inspector: instant buy, bag, per-seller buy, kit pairs and the combo. */
export function useItemMobileCart(item: ItemMobile) {
  const router = useRouter();
  const { items, addItem } = useCart();
  const has = (id: string) => items.some((line) => line.id === id);
  const checkoutAction = { label: "Checkout", onClick: () => router.push("/checkout") };
  const floor = item.sellers.reduce((best, seller) => (seller.priceUsd < best.priceUsd ? seller : best), item.sellers[0]);

  const buyFrom = (seller: MobileSeller) => {
    if (has(item.cartId)) {
      toast(`${item.name} is already in your basket`, { description: "Swap sellers at checkout.", action: checkoutAction });
      return;
    }
    addItem(sellerLine(item, seller));
    toast.success(`Trade opened with ${seller.name}`, { description: `${formatMoney(seller.priceUsd)} locked in escrow.`, action: checkoutAction });
  };

  return {
    floor,
    buyFrom,
    instantBuy: () => {
      if (!has(item.cartId)) addItem(sellerLine(item, floor));
      router.push("/checkout");
    },
    addToBag: () => buyFrom(floor),
    addPair: (entry: SynergyItem) => {
      if (!has(entry.id)) addItem(synergyLine(item, entry));
      toast.success(`${entry.name} added to your basket`, { action: checkoutAction });
    },
    equipCombo: () => {
      const priced = item.synergy.items.filter((entry) => entry.priceUsd !== undefined && !has(entry.id));
      priced.forEach((entry) => addItem(synergyLine(item, entry, item.synergy.discountPct)));
      toast.success(`${item.synergy.title} equipped`, {
        description: priced.length ? `${priced.length} items added with -${item.synergy.discountPct}% combo pricing.` : "The whole kit is already in your basket.",
        action: checkoutAction,
      });
    },
  };
}
