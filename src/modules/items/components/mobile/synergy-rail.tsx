"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useItemMobileCart } from "../../hooks/use-item-mobile-cart";
import type { ItemMobile, SynergyItem } from "../../mobile.types";

const TAG: Record<SynergyItem["tagTone"], string> = {
  muted: "bg-surface-container-lowest/80 text-text-secondary",
  crimson: "bg-primary-container font-bold text-on-primary",
  amber: "bg-surface-container-highest font-bold text-tertiary",
};

const CTA = "mt-1 h-auto w-full rounded border-0 bg-surface-container-high py-1 font-label-badge text-label-badge font-semibold text-text-primary hover:bg-surface-bright";

/** Matching kit: swipeable pairs plus the discounted combo. */
export function SynergyRail({ item }: { item: ItemMobile }) {
  const { addPair, equipCombo } = useItemMobileCart(item);
  const { synergy } = item;

  return (
    <div className="mb-space-lg flex flex-col gap-space-sm px-space-md py-space-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps tracking-wider text-secondary uppercase">{synergy.eyebrow}</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-text-primary">{synergy.title}</h3>
        </div>
        <Button
          variant={null}
          size={null}
          onClick={equipCombo}
          className="h-auto gap-1 rounded-lg border-0 bg-secondary px-space-sm py-1.5 font-label-badge text-label-badge font-bold text-on-secondary transition-all active:scale-95"
        >
          <Icon name="auto_fix_high" className="text-[14px]" />
          {synergy.cta} (-{synergy.discountPct}%)
        </Button>
      </div>

      <div className="no-scrollbar flex gap-space-sm overflow-x-auto pb-space-xs">
        {synergy.items.map((entry) => (
          <div key={entry.id} className="flex min-w-[160px] shrink-0 flex-col gap-space-xs rounded-xl bg-surface-card p-space-sm">
            <div className="relative h-24 w-full overflow-hidden rounded-lg bg-surface-container-lowest">
              <Image src={entry.image} alt={entry.imageAlt} width={320} height={192} sizes="160px" className="h-full w-full object-cover" />
              <span className={cn("absolute top-1 left-1 rounded px-1 font-label-badge text-[9px] uppercase", TAG[entry.tagTone])}>{entry.tag}</span>
            </div>
            <div className="flex flex-col">
              <span className="truncate font-label-caps text-[11px] text-text-primary">{entry.name}</span>
              {entry.priceUsd === undefined ? (
                <span className="font-data-mono-md text-data-mono-md text-text-secondary">{entry.note}</span>
              ) : (
                <span className="font-data-mono-md text-data-mono-md font-bold text-primary">{formatMoney(entry.priceUsd)}</span>
              )}
            </div>
            {entry.cta === "view" ? (
              <LinkButton href="/wiki" className={CTA}>
                View Slot
              </LinkButton>
            ) : (
              <Button variant={null} size={null} onClick={() => addPair(entry)} className={CTA}>
                + Add Pair
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
