"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Trophy } from "lucide-react";
import type { ChestSkinItem } from "../types";

export function ChestItemsGrid({ items }: { items: ChestSkinItem[] }) {
  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "arcana":
      case "cosmic":
        return "border-rose-500/50 bg-rose-500/10 text-rose-300";
      case "immortal":
        return "border-amber-500/50 bg-amber-500/10 text-amber-300";
      case "mythical":
      case "covert":
        return "border-purple-500/50 bg-purple-500/10 text-purple-300";
      case "legendary":
        return "border-pink-500/50 bg-pink-500/10 text-pink-300";
      default:
        return "border-cyan-500/50 bg-cyan-500/10 text-cyan-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-heading font-bold text-text-primary flex items-center gap-2">
          <Trophy className="size-4 text-primary" />
          Chest Contains ({items.length} Skins)
        </h3>
        <span className="text-[11px] font-mono text-text-muted">
          Odds normalized & verified
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map((item) => {
          const badgeClass = getRarityBadge(item.rarity);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-xl border border-border-subtle bg-surface-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              {item.isEscalatingBonus && (
                <span className="absolute -top-2 left-2 z-10 flex items-center gap-1 rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-mono font-bold text-black shadow-xs">
                  <Sparkles className="size-2.5" />
                  BONUS
                </span>
              )}

              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-container mb-2">
                <Image
                  src={item.imageUrl || "/images/lootora/hub-01.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 160px"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`px-1.5 py-0.2 rounded border uppercase font-bold ${badgeClass}`}>
                    {item.rarity}
                  </span>
                  <span className="text-text-muted font-bold">
                    {item.baseOddsPct}%
                  </span>
                </div>

                <div className="text-xs font-bold text-text-primary truncate" title={item.name}>
                  {item.name}
                </div>

                <div className="text-[10px] font-mono text-tertiary font-semibold">
                  ${item.valueUsd.toFixed(2)} USD
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
