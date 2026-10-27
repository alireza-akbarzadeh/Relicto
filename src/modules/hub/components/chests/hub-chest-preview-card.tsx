"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import type { ChestDefinition } from "@/modules/chests/types";

const RARITY_COLORS: Record<string, string> = {
  common: "border-slate-500",
  rare: "border-sky-400",
  mythical: "border-purple-400",
  immortal: "border-amber-400",
  arcana: "border-rose-500",
  covert: "border-red-500",
  cosmic: "border-fuchsia-400",
};

export function HubChestPreviewCard({ chest }: { chest: ChestDefinition }) {
  const topSkins = [...chest.items]
    .sort((a, b) => b.valueUsd - a.valueUsd)
    .slice(0, 3);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-surface-card/90 to-surface-deep/95 p-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-text-secondary border border-white/5">
            {chest.rankBadge}
          </span>
          {chest.hasEscalatingOdds && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/20">
              <TrendingUp className="size-3" />
              Escalating Odds
            </span>
          )}
        </div>

        {/* Chest Image Artwork */}
        <Link href={`/chests/${chest.slug}`} className="block relative aspect-4/3 w-full overflow-hidden rounded-xl bg-surface-container-low mb-3">
          <Image
            src={chest.imageUrl || "/images/lootora/hub-01.jpg"}
            alt={chest.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-tertiary">
              {chest.priceCoins.toLocaleString()} RC
            </span>
            <span className="font-mono text-xs text-text-muted">
              ${chest.priceUsd.toFixed(2)} USD
            </span>
          </div>
        </Link>

        {/* Chest Title & Description */}
        <Link href={`/chests/${chest.slug}`} className="block">
          <h3 className="font-heading font-extrabold text-sm text-text-primary group-hover:text-amber-400 transition-colors truncate">
            {chest.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-text-muted leading-relaxed">
            {chest.description}
          </p>
        </Link>

        {/* Top Skins Preview Strip */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-1.5">
            <span>Top Skin Pool:</span>
            <span>{chest.items.length} items</span>
          </div>
          <div className="flex items-center gap-2">
            {topSkins.map((skin) => {
              const border = RARITY_COLORS[skin.rarity] ?? "border-white/20";
              return (
                <div
                  key={skin.id}
                  className={`relative size-8 shrink-0 overflow-hidden rounded-lg bg-surface-container border ${border}`}
                  title={`${skin.name} ($${skin.valueUsd})`}
                >
                  <Image
                    src={skin.imageUrl}
                    alt={skin.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <Link
          href={`/chests/${chest.slug}`}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <Sparkles className="size-3.5 fill-current" />
          <span>Inspect & Open Case</span>
          <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
