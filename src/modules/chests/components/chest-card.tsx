"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Coins, Sparkles, Flame, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ChestDefinition, CurrencyConversion } from "../types";

export function ChestCard({
  chest,
  conversion,
}: {
  chest: ChestDefinition;
  conversion: CurrencyConversion;
}) {
  const tomanPrice = Math.round(chest.priceUsd * conversion.tomanRatePerUsd);

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case "legendary":
        return "border-rose-500/50 bg-rose-500/10 text-rose-300";
      case "divine":
        return "border-amber-500/50 bg-amber-500/10 text-amber-300";
      case "elite":
        return "border-cyan-500/50 bg-cyan-500/10 text-cyan-300";
      default:
        return "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border-subtle bg-surface-card/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,178,183,0.12)]">
      {/* Glow backdrop blob */}
      <div className="absolute -top-20 -right-20 size-44 rounded-full bg-primary/10 blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
        {/* Header: Tier chip & Open stats */}
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${getTierBadgeStyle(
              chest.tier
            )}`}
          >
            {chest.rankBadge}
          </span>
          <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
            <Flame className="size-3 text-tertiary" />
            {chest.openCount.toLocaleString()} Opened
          </span>
        </div>

        {/* Chest Visual Presentation */}
        <div className="relative mx-auto my-2 aspect-square w-36 sm:w-44 overflow-hidden rounded-xl bg-surface-container flex items-center justify-center border border-border-subtle/80 group-hover:border-primary/40 transition-colors shadow-inner">
          <Image
            src={chest.imageUrl || "/images/lootora/hub-01.jpg"}
            alt={chest.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 144px, 176px"
          />
          {chest.hasEscalatingOdds && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-400 backdrop-blur-xs border border-amber-500/30">
              <Sparkles className="size-2.5" />
              Escalating Odds
            </span>
          )}
        </div>

        {/* Name & Description */}
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base text-text-primary group-hover:text-primary transition-colors truncate">
            {chest.name}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {chest.description}
          </p>
        </div>

        {/* Skin items peek strip */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-text-secondary uppercase">
            Top Pool Drops ({chest.items.length})
          </span>
          <div className="flex items-center gap-1.5 overflow-hidden">
            {chest.items.slice(0, 5).map((it) => (
              <div
                key={it.id}
                title={`${it.name} - $${it.valueUsd}`}
                className="relative size-8 shrink-0 overflow-hidden rounded border border-border-subtle bg-surface-container hover:border-primary transition-colors"
              >
                <Image
                  src={it.imageUrl || "/images/lootora/hub-01.jpg"}
                  alt={it.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            ))}
            {chest.items.length > 5 && (
              <div className="size-8 shrink-0 rounded border border-border-subtle bg-surface-container flex items-center justify-center text-[10px] font-mono text-text-muted">
                +{chest.items.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-tertiary font-mono font-bold text-sm">
              <Coins className="size-4" />
              {chest.priceCoins.toLocaleString()} RC
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              ≈ ${chest.priceUsd.toFixed(2)} • {tomanPrice.toLocaleString()} تومان
            </span>
          </div>

          <Link href={`/chests/${chest.slug}`}>
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 font-bold text-xs shadow-md group-hover:bg-primary-container group-hover:text-on-primary-container transition-all"
            >
              <Eye className="size-3.5" />
              Inspect & Open
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
