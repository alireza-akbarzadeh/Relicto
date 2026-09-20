"use client";

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { InventoryItem, SellGame } from "../types";

const TONE = { primary: "bg-primary", amber: "bg-tertiary", cyan: "bg-status-upcoming", indigo: "bg-secondary", muted: "bg-text-muted" };
const TEXT = { primary: "text-primary", amber: "text-tertiary", cyan: "text-status-upcoming", indigo: "text-secondary", muted: "text-text-muted" };

export function InventoryList({ items, selected, onToggle, game, totalInventory, readyToList }: { items: InventoryItem[]; selected: string[]; onToggle: (id: string, checked: boolean) => void; game: SellGame; totalInventory: number; readyToList: number }) {
  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex flex-col justify-between gap-space-xs sm:flex-row sm:items-center"><div className="flex items-center gap-space-sm"><h2 className="font-headline-md text-base font-bold tracking-wide text-text-primary uppercase">Backpack Inventory</h2><span className="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 font-data-mono-md text-[10px] font-semibold text-primary">{readyToList} Ready To List</span></div><span className="font-data-mono-md text-xs text-text-secondary">Steam Sync: <span className="text-tertiary">30s ago</span></span></div>
      <div className="flex flex-col gap-space-sm">{items.map((item) => <InventoryRow key={item.id} item={item} checked={selected.includes(item.id)} onCheckedChange={(checked) => onToggle(item.id, checked)} />)}</div>
      <div className="flex flex-col items-center justify-between gap-space-sm rounded-lg border border-white/[0.06] bg-surface-container-lowest px-space-md py-2.5 text-xs sm:flex-row"><span className="font-data-mono-md text-text-secondary">Showing {items.length} of {totalInventory} tradable items</span><div className="flex items-center gap-space-sm"><span className="font-label-badge text-[11px] text-text-muted uppercase">Backpack Est. Value:</span><span className="font-data-mono-lg text-sm font-bold text-tertiary">$10,474.50 USD</span></div></div>
    </section>
  );
}

function InventoryRow({ item, checked, onCheckedChange }: { item: InventoryItem; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  const deltaTone = TEXT[item.deltaTone];
  return <article className={cn("relative rounded-lg border p-3 shadow-sm transition-all", checked ? "border-primary/50 bg-surface-card" : "border-white/[0.06] bg-surface-card/60 hover:bg-surface-card")}>
    {checked && <span className="absolute top-0 bottom-0 left-0 w-1 rounded-l bg-primary" />}
    <div className="flex flex-col items-start justify-between gap-space-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-space-sm"><Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} aria-label={`Select ${item.name}`} className="data-checked:border-primary data-checked:bg-primary" /><div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-white/[0.08] bg-surface-container-lowest"><Image src={item.image} alt={item.imageAlt} fill sizes="56px" className="object-cover" /><span className={cn("absolute top-0.5 left-0.5 rounded px-1 font-label-badge text-[9px] font-bold text-surface-container-lowest", TONE[item.tone])}>{item.marker}</span></div><div className="flex min-w-0 flex-col"><div className="flex flex-wrap items-center gap-1.5"><span className="truncate font-headline-sm text-xs font-semibold text-text-primary sm:text-sm">{item.name}</span><span className="rounded border border-primary/30 bg-primary/20 px-1.5 py-0.5 font-label-badge text-[10px] text-primary uppercase">{item.rarity}</span></div><span className="font-data-mono-md text-xs text-status-upcoming">{item.wear} <span className="text-text-muted">· Float: {item.float}{item.rank ? ` (${item.rank})` : ""}</span></span><div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-surface-container-highest"><div className={cn("h-full", TONE[item.tone])} style={{ width: `${item.wearPct}%` }} /></div></div></div>
      <div className="flex min-w-[130px] flex-col text-left sm:items-end sm:text-right"><span className="font-data-mono-lg text-base font-bold text-tertiary">{formatMoney(item.price)}</span><span className="font-data-mono-md text-[11px] text-text-muted">Floor: {formatMoney(item.floor)}</span><span className={cn("font-data-mono-md text-[11px] font-semibold", deltaTone)}>{item.delta}</span></div>
    </div>
  </article>;
}
