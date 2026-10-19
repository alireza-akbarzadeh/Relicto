"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { cn } from "@/lib/cn";
import { depositFunds } from "@/modules/wallet/actions/treasury";
import { useListingWrites } from "../hooks/use-listing-writes";
import type { InventoryItem } from "../types";
import { MODES, type LiquidityMode, getWearBadge, formatToken, getActionDetails } from "./listing-focus-helpers";

export function ListingFocus({ item }: { item: InventoryItem }) {
  const [mode, setMode] = useState<LiquidityMode>(MODES[0]);
  const [price, setPrice] = useState(item.price.toFixed(2));
  const [note, setNote] = useState(item.rank ? `Float ${item.float} · ${item.rank}` : `Float ${item.float}`);
  const { pending, list } = useListingWrites();
  const [liquidating, startLiquidating] = useTransition();

  const numPrice = Number(price || 0);
  const fee = numPrice * 0.02;
  const proceeds = Math.max(0, numPrice - fee);
  const wearBadge = getWearBadge(item);
  const token = formatToken(item.id);
  const counterMin = (item.floor * 0.8).toFixed(0);
  const deltaVsFloor = item.floor > 0 ? (((numPrice - item.floor) / item.floor) * 100).toFixed(1) : "0.0";
  const deltaSign = Number(deltaVsFloor) >= 0 ? "+" : "";
  const [allowOffers, setAllowOffers] = useState(true);
  const action = getActionDetails(mode, liquidating, pending, proceeds, numPrice);

  const handleAction = () => {
    if (mode === "Instant Bot") {
      if (proceeds <= 0) {
        toast.error("Valuation must be greater than $0");
        return;
      }
      startLiquidating(async () => {
        try {
          const result = await depositFunds({
            rail: "crypto",
            amountUsd: proceeds,
            txHash: `BOT-LIQUIDATE-${item.id}`,
          });
          if (result.status === "credited") {
            toast.success(`Liquidated ${item.name} for $${proceeds.toFixed(2)}`, {
              description: "Instant bot liquidity credited to your Relicto USD Vault.",
            });
          } else {
            toast.error("Liquidation paused", { description: "Vault is locked or rail is unavailable." });
          }
        } catch {
          toast.error("Liquidation dispatch failed", { description: "Check your connection and try again." });
        }
      });
      return;
    }

    if (mode === "24H Auction") {
      list(item, numPrice, `[24H Auction] ${note}`, allowOffers, allowOffers ? Number(counterMin) : undefined);
      return;
    }

    list(item, numPrice, note, allowOffers, allowOffers ? Number(counterMin) : undefined);
  };

  return (
    <aside className="flex flex-col gap-space-md rounded-xl border border-white/[0.08] bg-surface-card p-space-md shadow-xl lg:p-space-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <h2 className="font-headline-md text-base font-bold tracking-wide text-text-primary uppercase">Listing Focus</h2>
        </div>
        <span className="rounded border border-white/[0.06] bg-surface-container-lowest px-2 py-0.5 font-data-mono-md text-[11px] text-text-muted">{token}</span>
      </div>
      <div className="flex items-center gap-space-sm overflow-hidden rounded-lg border border-white/[0.08] bg-surface-container-lowest p-3">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-white/[0.08] bg-surface-card">
          <Image src={item.image} alt={item.imageAlt} fill sizes="64px" className="object-cover" />
          <span className="absolute right-1 bottom-1 rounded bg-surface-deep/90 px-1 font-data-mono-md text-[9px] font-bold text-status-upcoming">{wearBadge}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="font-label-badge text-[10px] font-bold tracking-wider text-primary uppercase">{item.game.toUpperCase()} · {item.rarity}</span>
          <h3 className="truncate font-headline-sm text-sm font-bold text-text-primary">{item.name}</h3>
          <div className="flex items-center gap-1.5 font-data-mono-md text-xs text-text-secondary">
            <span className="text-status-upcoming">Float: {item.float}</span>
            <span className="text-white/20">·</span>
            <span className="text-tertiary">{item.rank || "Verified Pattern"}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-[11px] font-semibold tracking-wider text-text-muted uppercase">Listing Liquidity Mode</label>
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-white/[0.06] bg-surface-container-lowest p-1">
          {MODES.map((option) => (
            <Button key={option} variant={null} size={null} onClick={() => setMode(option)} className={cn("h-auto rounded py-1.5 font-headline-sm text-xs uppercase", mode === option ? "bg-primary font-bold text-white" : "text-text-muted hover:text-text-primary")}>{option}</Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="target-price" className="font-label-caps text-[11px] font-semibold tracking-wider text-text-muted uppercase">Target Ask Price (USD)</label>
          <span className="rounded border border-status-upcoming/20 bg-status-upcoming/10 px-2 py-0.5 font-data-mono-md text-[11px] text-status-upcoming">Floor (${item.floor.toLocaleString()}) {deltaSign}{deltaVsFloor}%</span>
        </div>
        <PriceInput
          id="target-price"
          value={numPrice}
          onChange={(val) => setPrice(val.toString())}
          className="h-11 bg-surface-container-lowest px-3 text-base font-bold text-text-primary"
        />
        <div className="grid grid-cols-3 gap-1.5">
          {[0.9, 0.99, 1.15].map((multiplier) => (
            <Button key={multiplier} variant={null} size={null} onClick={() => setPrice((item.floor * multiplier).toFixed(2))} className="h-auto rounded bg-surface-container-low px-1 py-1 font-data-mono-md text-[11px] text-text-secondary hover:bg-surface-bright">
              {multiplier === 0.9 ? `-10% ($${(item.floor * 0.9).toFixed(0)})` : multiplier === 1.15 ? `+15% ($${(item.floor * 1.15).toFixed(0)})` : `-1% Floor ($${(item.floor * 0.99).toFixed(0)})`}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-white/[0.08] bg-surface-container-lowest p-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
          <span className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">Escrow Settlement Ledger</span>
          <span className="font-data-mono-md text-[10px] font-semibold text-primary">
            {mode === "Instant Bot" ? "Instant Automated Payout" : mode === "24H Auction" ? "Time-Decay Escrow" : "Tier 1 Pro Liquidity"}
          </span>
        </div>
        <div className="flex flex-col gap-1 font-data-mono-md text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>{mode === "Instant Bot" ? "Instant Asset Valuation:" : "Gross Listed Value:"}</span>
            <span className="font-semibold text-text-primary">${numPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>{mode === "Instant Bot" ? "Liquidity Bot Spread (2.0%):" : "Relicto Platform Fee (2.0%):"}</span>
            <span className="font-semibold text-primary">-${fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-secondary"><span>Steam Bot Relay:</span><span className="font-semibold text-status-upcoming">$0.00 (Free)</span></div>
          <div className="my-1 h-px bg-white/[0.06]" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-text-primary">
              {mode === "Instant Bot" ? "Immediate Vault Credit:" : "Net Trader Proceeds:"}
            </span>
            <span className="font-data-mono-lg text-base font-bold text-tertiary">${proceeds.toFixed(2)} USD</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-label-caps text-[11px] font-semibold tracking-wider text-text-muted uppercase">Settlement Preferences</span>
        <label className="flex items-center justify-between rounded border border-white/[0.06] bg-surface-container-lowest px-3 py-2">
          <span className="flex items-center gap-2 font-body-md text-xs text-text-primary"><Checkbox defaultChecked />Instant Crypto Settlement (USDT / Arbitrum)</span>
          <span className="font-label-badge text-[10px] font-bold text-status-upcoming uppercase">Zero Gas</span>
        </label>
        <label className="flex cursor-pointer items-center justify-between rounded border border-white/[0.06] bg-surface-container-lowest px-3 py-2">
          <span className="flex items-center gap-2 font-body-md text-xs text-text-primary">
            <Checkbox checked={allowOffers} onCheckedChange={(val) => setAllowOffers(Boolean(val))} />
            Allow Counter-Offers (Min: ${counterMin})
          </span>
          <Icon name="tune" className="text-[15px] text-tertiary" />
        </label>
      </div>
      <label htmlFor="buyer-note" className="flex flex-col gap-1.5 font-label-caps text-[11px] font-semibold tracking-wider text-text-muted uppercase">
        Trader Buyer Note / Craft Intel
        <Input id="buyer-note" value={note} onChange={(event) => setNote(event.target.value)} className="h-auto rounded bg-surface-container-lowest px-3 py-1.5 font-data-mono-md text-xs text-text-secondary" />
      </label>
      <div className="flex flex-col gap-2 pt-1">
        <Button
          variant={null}
          size={null}
          disabled={pending || liquidating}
          onClick={handleAction}
          className={cn(
            "h-auto w-full gap-2 rounded py-2.5 font-headline-md text-sm font-bold tracking-wider uppercase transition-all",
            mode === "Instant Bot"
              ? "bg-tertiary text-on-tertiary-container shadow-[0_0_16px_rgba(245,158,11,0.35)] hover:bg-tertiary-fixed"
              : "bg-primary text-white shadow-[0_0_16px_rgba(244,63,94,0.35)] hover:bg-primary/90",
          )}
        >
          <Icon name={action.icon} className="text-[18px]" />
          {action.label}
        </Button>
        <div className="flex items-center justify-center gap-1 text-center font-data-mono-md text-[11px] text-text-muted">
          <Icon name="verified_user" className="text-[13px] text-status-upcoming" />
          {action.notice}
        </div>
      </div>
    </aside>
  );
}

