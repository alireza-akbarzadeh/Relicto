"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { DeliveryBadge } from "@/modules/marketplace/components/delivery/delivery-badge";
import { calculateDeliverySla } from "@/modules/marketplace/lib/delivery-sla";
import { useWatchlist } from "@/modules/relicto/state/watchlist-provider";
import { useItemBuy } from "../../hooks/use-item-buy";
import { STAT_TONE } from "../../lib/tones";
import type { ItemDetail } from "../../types";

export interface ValuationTabContentProps {
  item: ItemDetail | null;
  image: string;
  imageAlt: string;
  priceUsd: number;
  isPending: boolean;
  name: string;
}

export function ValuationTabContent({
  item,
  image,
  imageAlt,
  priceUsd,
  isPending,
  name,
}: ValuationTabContentProps) {
  const { isWatched, toggle } = useWatchlist();
  const watched = item ? isWatched(item.slug) : false;
  const buyActions = useItemBuy(item);
  const delivery =
    buyActions.floor?.delivery ??
    item?.delivery ??
    calculateDeliverySla({
      name,
      rarity: item?.badges[0]?.variant,
    });

  const handleCopilotAudit = () => {
    window.dispatchEvent(
      new CustomEvent("relicto:open-copilot-query", {
        detail: `Audit asset: ${name} (${formatMoney(priceUsd)} USD). What are the Valve 7-day cooldown rules and float wear parameters?`,
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
      <div className="md:col-span-5 relative flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container-lowest/80 border border-white/5 overflow-hidden group">
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-primary/10 blur-3xl" />
        {image && (
          <Image
            src={image}
            alt={imageAlt}
            width={280}
            height={200}
            className="relative z-10 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="mt-4 flex items-center gap-2">
          <span className="font-label-badge text-[11px] text-text-muted">
            60 FPS Source 2 In-Engine Telemetry
          </span>
        </div>
      </div>

      <div className="md:col-span-7 flex flex-col gap-4">
        <div className="flex items-baseline justify-between rounded-xl bg-surface-container-lowest/80 p-4 border border-white/5">
          <div>
            <span className="font-label-badge text-[10px] uppercase text-text-muted">
              Lowest Real-Time Price
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-data-mono-lg text-3xl font-extrabold text-tertiary">
                {formatMoney(priceUsd)}
              </span>
              <span className="font-data-mono-md text-xs text-text-muted">USD</span>
            </div>
          </div>
          {item?.price.moveLabel && (
            <span className="rounded bg-emerald-500/10 px-2 py-1 font-data-mono-md text-xs font-bold text-emerald-400 border border-emerald-500/20">
              {item.price.moveLabel}
            </span>
          )}
        </div>

        {item?.price.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {item.price.stats.map((s) => (
              <div
                key={s.label}
                className="p-2 rounded-lg bg-surface-container-lowest/60 border border-white/5 text-center"
              >
                <span className="block font-label-badge text-[9px] uppercase text-text-muted truncate">
                  {s.label}
                </span>
                <span className={cn("font-data-mono-md text-xs font-bold", STAT_TONE[s.tone])}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <DeliveryBadge sla={delivery} variant="callout" />

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
          <Button
            type="button"
            disabled={!item || isPending || !buyActions?.floor}
            onClick={() => void buyActions?.buyNow()}
            className="h-11 flex-1 gap-2 rounded-xl bg-tertiary font-headline-sm text-xs font-bold tracking-wider text-on-tertiary-container uppercase shadow-lg shadow-tertiary/20 hover:bg-tertiary-fixed transition-all"
          >
            <Icon name="bolt" className="text-[18px]" />
            <span>Instant Buy — {formatMoney(priceUsd)}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={!item || isPending}
            onClick={() => buyActions?.addToBasket()}
            className="h-11 px-4 gap-2 rounded-xl border-white/10 hover:bg-white/5 text-xs font-semibold"
          >
            <Icon name="add_shopping_cart" className="text-[18px]" />
            <span>Add</span>
          </Button>

          {item && (
            <Button
              type="button"
              variant="outline"
              onClick={() => toggle(item.slug, item.name)}
              className={cn(
                "h-11 px-3.5 rounded-xl border-white/10 transition-colors",
                watched ? "text-primary border-primary/30" : "text-text-muted"
              )}
            >
              <Icon name="favorite" filled={watched} className="text-[18px]" />
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant={null}
          size={null}
          onClick={handleCopilotAudit}
          className="flex items-center justify-between w-full p-2.5 rounded-lg border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-mono text-xs transition-colors group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-white">Ask Sentinel AI:</span>
            <span className="text-slate-300 truncate text-[11px]">
              Audit float, 7-day hold &amp; escrow
            </span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 group-hover:bg-rose-500 group-hover:text-white transition-all">
            Audit ⚡
          </span>
        </Button>
      </div>
    </div>
  );
}
