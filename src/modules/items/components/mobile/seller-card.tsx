"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { MobileSeller, SellerTagTone } from "../../mobile.types";

const TAG: Record<SellerTagTone, string> = {
  plain: "bg-surface-container-lowest text-text-primary",
  amber: "bg-surface-container-lowest font-bold text-tertiary",
  crimson: "bg-surface-container-lowest font-bold text-primary",
  indigo: "bg-secondary-container/40 font-medium text-secondary-fixed",
};

type SellerCardProps = { seller: MobileSeller; floor: boolean; onBuy: (seller: MobileSeller) => void };

/** One verified listing: seller trust, price, item tags, delivery and buy. */
export function SellerCard({ seller, floor, onBuy }: SellerCardProps) {
  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-xs transition-all hover:bg-surface-container">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high font-label-badge font-bold text-text-primary">
            {seller.initials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-label-caps text-text-primary">{seller.name}</span>
              {seller.badge && <Icon name={seller.badge} className="text-[14px] text-tertiary" />}
            </div>
            <span className="font-label-badge text-label-badge text-text-muted">{seller.trust}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-data-mono-lg text-data-mono-lg font-bold text-text-primary">{formatMoney(seller.priceUsd)}</span>
          <span className={cn("font-label-badge text-[10px]", floor ? "text-tertiary" : "text-text-muted")}>{floor ? "LOWEST FLOOR" : "USD"}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-space-xs text-text-secondary">
        {seller.tags.map((tag) => (
          <span key={tag.label} className={cn("rounded px-2 py-0.5 font-label-badge text-label-badge", TAG[tag.tone])}>
            {tag.label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-space-xs">
        <span className="font-label-badge text-label-badge text-text-muted">{seller.delivery}</span>
        <Button
          variant={null}
          size={null}
          onClick={() => onBuy(seller)}
          className={cn(
            "h-auto rounded-lg border-0 px-space-md py-2 font-label-caps text-label-caps font-bold uppercase transition-all active:scale-95",
            floor ? "bg-primary text-on-primary" : "bg-surface-container-highest text-text-primary hover:bg-primary hover:text-on-primary",
          )}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
