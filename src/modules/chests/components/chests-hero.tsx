"use client";

import * as React from "react";
import { Coins, Gift, Sparkles, SlidersHorizontal, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CurrencyConversion } from "../types";

export function ChestsHero({
  userCoins,
  conversion,
  selectedTier,
  onSelectTier,
  onOpenDailyBonus,
  onOpenBuyCoins,
  onOpenConverter,
}: {
  userCoins: number;
  conversion: CurrencyConversion;
  selectedTier: string;
  onSelectTier: (tier: string) => void;
  onOpenDailyBonus: () => void;
  onOpenBuyCoins: () => void;
  onOpenConverter: () => void;
}) {
  const userUsd = (userCoins / conversion.coinRatePerUsd).toFixed(2);
  const userToman = Math.round(
    (userCoins / conversion.coinRatePerUsd) * conversion.tomanRatePerUsd
  ).toLocaleString();

  const TIERS = [
    { id: "all", label: "All Chests" },
    { id: "beginner", label: "Scout / Beginner" },
    { id: "elite", label: "Global Elite" },
    { id: "divine", label: "Divine Reliquary" },
    { id: "legendary", label: "Arcana Vault" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-b from-surface-card via-surface-container to-surface-card p-6 md:p-8 backdrop-blur-xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-tertiary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Headline and Pitch */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary">
            <Sparkles className="size-3.5 animate-spin" />
            DOTA 2 ESCALATING ODDS & CS2 CRATES
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-text-primary tracking-tight leading-tight">
            Treasury Chests & Authentic Unboxing
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Open tournament-grade cases with verifiable Valve escalating odds. Earn Relicto Coins,
            claim daily drop bonuses, or unbox coveted Arcanas and Doppler knives with instant recycling.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              Provably Fair
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="size-3.5 text-tertiary" />
              Instant Inventory Handoff
            </span>
            <span>•</span>
            <span>85% Coin Buyback</span>
          </div>
        </div>

        {/* Right Column: User Vault Balance & Actions */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface-container-high/80 p-4 sm:p-5 backdrop-blur-md shrink-0 md:min-w-[300px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-text-secondary">Your Treasury</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              LIVE COINS
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <Coins className="size-6 text-tertiary" />
            <span className="font-heading font-black text-2xl sm:text-3xl text-text-primary font-mono">
              {userCoins.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-text-muted">RC</span>
          </div>

          <div className="text-[11px] font-mono text-text-muted">
            ≈ ${userUsd} USD • {userToman} تومان
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
            <Button
              size="sm"
              variant="default"
              onClick={onOpenBuyCoins}
              className="gap-1.5 font-bold text-xs bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary"
            >
              <Coins className="size-3.5" />
              Buy Coins
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenDailyBonus}
              className="gap-1.5 font-bold text-xs"
            >
              <Gift className="size-3.5 text-primary" />
              Daily Bonus
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Filter Navigation */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-border-subtle">
        <div className="flex flex-wrap items-center gap-1.5">
          <SlidersHorizontal className="size-3.5 text-text-muted mr-1" />
          {TIERS.map((t) => (
            <Button
              key={t.id}
              size="xs"
              variant={selectedTier === t.id ? "default" : "ghost"}
              onClick={() => onSelectTier(t.id)}
              className="font-mono text-xs rounded-lg h-7 px-3"
            >
              {t.label}
            </Button>
          ))}
        </div>

        <Button
          size="xs"
          variant="outline"
          onClick={onOpenConverter}
          className="font-mono text-xs gap-1.5 text-text-secondary hover:text-text-primary"
        >
          <Coins className="size-3 text-tertiary" />
          Currency Rates & Calculator
        </Button>
      </div>
    </div>
  );
}
