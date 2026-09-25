"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useWatchlist } from "@/modules/relicto/state/watchlist-provider";
import { TONE_GLOW, TONE_TEXT } from "../../lib/tones";
import type { WatchedItem } from "../../types";

/**
 * One watched item: what it costs right now, how it moved, and the two things
 * a watcher wants to do — buy the cheapest copy, or stop watching.
 */
export function WatchedCard({ item, onBuy }: { item: WatchedItem; onBuy: (item: WatchedItem) => void }) {
  const { toggle } = useWatchlist();
  const move = item.changePercent ?? 0;
  const forSale = item.listingId !== null && item.floorUsd !== null;

  return (
    <article className="group relative flex gap-space-md overflow-hidden rounded-xl bg-surface-card p-space-md transition-colors hover:bg-surface-container-high">
      <div className={cn("pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl", TONE_GLOW[item.tone])} />

      <Link
        href={`/items/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="96px"
            className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-space-sm">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="min-w-0">
            <span className={cn("font-label-badge text-[10px] font-bold tracking-wider uppercase", TONE_TEXT[item.tone])}>
              {item.rarityLabel || item.gameLabel}
            </span>
            <Link href={`/items/${item.slug}`} className="block">
              <h3 className="truncate font-headline-sm text-headline-sm font-bold text-text-primary transition-colors hover:text-primary">
                {item.name}
              </h3>
            </Link>
            <span className="block truncate font-body-sm text-body-sm text-text-secondary">{item.subtitle}</span>
          </div>

          <Button
            variant={null}
            size={null}
            onClick={() => toggle(item.slug, item.name)}
            aria-label={`Stop watching ${item.name}`}
            title="Stop watching"
            className="h-auto shrink-0 rounded border-0 p-1 text-primary transition-colors hover:text-text-muted"
          >
            <Icon name="favorite" filled className="text-[18px]" />
          </Button>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-space-sm">
          <div className="flex flex-col">
            {forSale ? (
              <span className="flex items-baseline gap-1.5">
                <span className="font-data-mono-lg text-data-mono-lg font-bold text-text-primary">
                  {formatMoney(item.floorUsd!)}
                </span>
                {move !== 0 && (
                  <span className={cn("font-data-mono-md text-[11px] font-bold", move > 0 ? "text-status-upcoming" : "text-primary")}>
                    {move > 0 ? "+" : ""}
                    {move.toFixed(1)}%
                  </span>
                )}
              </span>
            ) : (
              <span className="font-data-mono-md text-data-mono-md font-bold text-text-muted">No sellers</span>
            )}
            <span className="font-label-badge text-[10px] text-text-muted uppercase">
              {forSale
                ? `Floor · ${item.sellerCount} seller${item.sellerCount === 1 ? "" : "s"}`
                : `Watched ${item.watchedAgo}`}
            </span>
          </div>

          <Button
            variant={null}
            size={null}
            disabled={!forSale}
            onClick={() => onBuy(item)}
            className="h-auto rounded-lg bg-primary-container px-space-md py-1.5 font-headline-sm text-[12px] font-bold tracking-wide text-on-primary-container uppercase transition-colors hover:bg-primary disabled:pointer-events-none disabled:bg-surface-container disabled:text-text-muted"
          >
            {forSale ? "Add to basket" : "Unavailable"}
          </Button>
        </div>
      </div>
    </article>
  );
}
