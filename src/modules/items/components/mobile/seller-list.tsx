"use client";

import { useQueryStates } from "nuqs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { useItemMobileCart } from "../../hooks/use-item-mobile-cart";
import { SELLER_SORTS, SELLER_SORT_LABEL, arrangeSellers, sellerBookSearchParams, type SellerSort } from "../../lib/seller-book";
import type { ItemMobile } from "../../mobile.types";
import { SellerCard } from "./seller-card";

/** Live verified listings with sort / instant-bot filters kept in the URL. */
export function SellerList({ item }: { item: ItemMobile }) {
  const [{ sellers: sort, instant }, setQuery] = useQueryStates(sellerBookSearchParams, { history: "replace", clearOnDefault: true });
  const { floor, buyFrom } = useItemMobileCart(item);
  const shown = arrangeSellers(item.sellers, sort, instant);

  return (
    <div className="flex flex-col gap-space-sm px-space-md py-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <h3 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">Available Marketplace Listings</h3>
          <span className="font-data-mono-md text-data-mono-md text-text-secondary">({shown.length})</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-0.5 font-label-badge text-label-badge font-bold text-primary uppercase outline-hidden">
            Filters <Icon name="tune" className="text-[14px]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort sellers</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={(next) => void setQuery({ sellers: next as SellerSort })}>
                {SELLER_SORTS.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {SELLER_SORT_LABEL[option]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={instant} onCheckedChange={(checked) => void setQuery({ instant: checked })}>
              Instant escrow bots only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {shown.map((seller) => (
        <SellerCard key={seller.id} seller={seller} floor={seller.id === floor.id} onBuy={buyFrom} />
      ))}
    </div>
  );
}
