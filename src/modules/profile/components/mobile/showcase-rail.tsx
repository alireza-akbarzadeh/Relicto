"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { TONE_TEXT } from "../../lib/mobile-tones";
import type { ProfileMobile, ShowcaseCard } from "../../mobile.types";

function Card({ card, available, onToggle }: { card: ShowcaseCard; available: boolean; onToggle: () => void }) {
  return (
    <div className="flex max-w-[240px] min-w-[240px] shrink-0 flex-col justify-between rounded-xl bg-surface-card p-space-sm shadow-md">
      <Link href={`/items/${card.slug}`} className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest">
        <Image src={card.image} alt={card.imageAlt} width={480} height={256} sizes="240px" className="h-full w-full object-cover" />
        <span
          className={cn(
            "absolute top-1.5 left-1.5 rounded bg-surface-container-lowest/80 px-1.5 py-0.5 font-label-badge text-[9px] font-bold uppercase backdrop-blur-sm",
            TONE_TEXT[card.tagTone],
          )}
        >
          {card.tag}
        </span>
        <span className="absolute right-1.5 bottom-1.5 rounded bg-surface-container-lowest/90 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-tertiary">
          {formatMoney(card.priceUsd)}
        </span>
      </Link>
      <div className="mt-2 flex flex-col">
        <h2 className="truncate font-headline-sm text-[13px] font-bold text-text-primary">{card.name}</h2>
        <span className="truncate font-body-sm text-[11px] text-text-muted">{card.detail}</span>
      </div>
      <div className="mt-2 flex items-center justify-between rounded bg-surface-container-lowest p-1.5 pt-2">
        <div className="flex flex-col">
          <span className="font-label-badge text-[9px] text-text-muted uppercase">{card.stat.label}</span>
          <span className={cn("font-data-mono-md text-[11px] font-bold", TONE_TEXT[card.stat.tone])}>{card.stat.value}</span>
        </div>
        <Button
          variant={null}
          size={null}
          aria-pressed={available}
          onClick={onToggle}
          className={cn(
            "h-auto rounded border-0 px-2 py-1 font-label-badge text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95",
            available ? "bg-primary-container text-text-primary" : "bg-surface-container-high text-text-muted",
          )}
        >
          {available ? "AVAILABLE" : "VAULT LOCKED"}
        </Button>
      </div>
    </div>
  );
}

/** Featured items, each switchable between tradable and vault-locked. */
export function ShowcaseRail({ showcase }: { showcase: ProfileMobile["showcase"] }) {
  const [available, setAvailable] = useState(() => Object.fromEntries(showcase.items.map((card) => [card.id, card.available])));

  const toggle = (card: ShowcaseCard) => {
    const next = !available[card.id];
    setAvailable((current) => ({ ...current, [card.id]: next }));
    toast(next ? `${card.name} is open to offers` : `${card.name} locked in the vault`);
  };

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Icon name="diamond" className="text-[18px] text-primary-container" />
          <span className="font-headline-sm text-[15px] tracking-tight text-text-primary uppercase">Prestige Trader Showcase</span>
        </div>
        <span className="font-label-badge text-label-badge text-text-muted uppercase">
          {showcase.items.length} OF {showcase.total} DISPLAYED
        </span>
      </div>
      <div className="no-scrollbar -mx-space-md flex gap-space-sm overflow-x-auto px-space-md pb-1">
        {showcase.items.map((card) => (
          <Card key={card.id} card={card} available={available[card.id]} onToggle={() => toggle(card)} />
        ))}
      </div>
    </div>
  );
}
