"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { useItemMobileCart } from "../../hooks/use-item-mobile-cart";
import type { ItemMobile } from "../../mobile.types";

/** Primary buy button (floor seller, straight to checkout) and add-to-bag. */
export function InstantActions({ item }: { item: ItemMobile }) {
  const { floor, instantBuy, addToBag } = useItemMobileCart(item);

  return (
    <div className="flex gap-space-sm px-space-md py-space-sm">
      <Button
        variant={null}
        size={null}
        onClick={instantBuy}
        className="h-auto flex-1 gap-space-xs rounded-xl border-0 bg-primary-container px-space-md py-3.5 font-label-caps text-label-caps font-bold text-on-primary uppercase shadow-[0_0_16px_rgba(244,63,94,0.4)] transition-all active:scale-[0.98]"
      >
        <Icon name="bolt" className="text-[18px]" />
        <span>Instant Buy with Escrow · {formatMoney(floor.priceUsd)}</span>
      </Button>
      <Button
        variant={null}
        size={null}
        aria-label="Add to cart"
        onClick={addToBag}
        className="h-auto rounded-xl border-0 bg-surface-container-high px-3.5 text-text-primary transition-all hover:bg-surface-bright active:scale-95"
      >
        <Icon name="shopping_bag" className="text-[20px]" />
      </Button>
    </div>
  );
}
