"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { SearchItem } from "../types";

const GAME = {
  cs2: "CS2 Market",
  dota2: "Dota 2 Asset",
  tf2: "TF2 Asset",
} as const;

type ItemResultProps = {
  item: SearchItem;
  active: boolean;
  onHover: () => void;
  onOpen: () => void;
  onBasket: () => void;
};

/** One match: art, name and chips, the copy's float and seed, and the floor against an outside reference. */
export function ItemResult({
  item,
  active,
  onHover,
  onOpen,
  onBasket,
}: ItemResultProps) {
  const cheaper = item.deltaPct !== null && item.deltaPct < 0;

  return (
    <div
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onOpen}
      className={cn(
        "group relative flex cursor-pointer flex-col justify-between gap-space-md rounded-lg p-space-md transition-all md:flex-row md:items-center",
        active
          ? "bg-surface-container/90 shadow-[0_0_24px_-4px_rgba(244,63,94,0.35)]"
          : "bg-surface-deep/80 shadow-sm hover:bg-surface-container",
      )}
    >
      {active && (
        <div className="absolute top-2 bottom-2 -left-1 w-1.5 rounded-r bg-primary shadow-[0_0_10px_var(--color-primary-container)]" />
      )}
      <div className="flex min-w-0 items-start gap-space-md md:items-center">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-lowest p-1 shadow-inner">
          {item.image && (
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="64px"
              className="object-contain p-1"
            />
          )}
          {item.corner && (
            <span className="absolute right-0.5 bottom-0.5 rounded bg-secondary-container px-1 font-label-badge text-[9px] font-bold text-on-secondary-container uppercase">
              {item.corner}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "truncate font-headline-sm text-headline-sm font-bold text-text-primary transition-colors",
                active && "text-primary",
              )}
            >
              {item.name}
            </span>
            {item.chips.slice(0, 2).map((chip) => (
              <span
                key={chip}
                className="rounded bg-surface-container-highest px-2 py-0.5 font-label-badge text-label-badge font-bold text-secondary uppercase"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-space-md font-data-mono-md text-data-mono-md text-text-muted">
            {item.floatValue !== null && (
              <div className="flex items-center gap-1">
                <span className="text-[11px]">FLOAT</span>
                <span className="font-bold text-text-primary">
                  {item.floatValue.toFixed(6)}
                </span>
                <span className="ml-1 inline-block h-1.5 w-12 overflow-hidden rounded-full bg-surface-container-lowest">
                  <span
                    className="block h-full bg-status-upcoming"
                    style={{ width: `${Math.max(4, item.floatValue * 100)}%` }}
                  />
                </span>
              </div>
            )}
            {item.paintSeed !== null && (
              <div>
                <span className="text-[11px]">PATTERN </span>
                <span className="font-bold text-tertiary">
                  #{item.paintSeed}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[12px] text-status-upcoming">
              <Icon name="bolt" className="text-[14px]" />
              <span>
                {item.copies} {item.copies === 1 ? "copy" : "copies"} · Instant
                Escrow
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between md:flex-col md:items-end md:justify-center">
        <div className="text-left md:text-right">
          <div className="flex items-baseline gap-1.5 md:justify-end">
            <span className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary">
              {formatMoney(item.floorUsd)}
            </span>
            {item.reference && cheaper && (
              <span className="font-data-mono-md text-[12px] text-text-muted line-through">
                {formatMoney(item.reference.usd)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 md:justify-end">
            {item.reference && item.deltaPct !== null && (
              <span
                className={cn(
                  "rounded px-1 font-label-badge text-label-badge font-bold",
                  cheaper
                    ? "bg-status-upcoming/15 text-status-upcoming"
                    : "bg-surface-container-high text-text-muted",
                )}
              >
                {cheaper ? "" : "+"}
                {Math.round(item.deltaPct)}% vs {item.reference.venue}
              </span>
            )}
            <span className="font-label-badge text-label-badge text-text-muted">
              {GAME[item.game]}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <Button
            variant={null}
            size={null}
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="h-auto gap-1 rounded border-0 bg-surface-container-highest px-2.5 py-1.5 font-label-caps text-[11px] tracking-wider text-text-primary uppercase transition-colors hover:bg-surface-bright"
          >
            <Icon name="open_in_new" className="text-[14px]" />
            <span>Inspect</span>
          </Button>
          <Button
            variant={null}
            size={null}
            onClick={(event) => {
              event.stopPropagation();
              onBasket();
            }}
            className="h-auto gap-1 rounded border-0 bg-primary-container px-3 py-1.5 font-label-caps text-[11px] font-bold tracking-wider text-on-primary-container uppercase shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-colors hover:bg-primary-container/90"
          >
            <Icon name="add_shopping_cart" className="text-[14px]" />
            <span>Add to Basket</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
