"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Flame, ArrowRight } from "lucide-react";
import type { ChestDefinition } from "@/modules/chests/types";

export function MobileChestsSection({ initialChests = [] }: { initialChests?: ChestDefinition[] }) {
  const [chests, setChests] = React.useState<ChestDefinition[]>(initialChests);

  React.useEffect(() => {
    if (chests.length === 0) {
      fetch("/api/chests", { priority: "low" })
        .then((r) => r.json())
        .then((data) => {
          if (data.chests) setChests(data.chests);
        })
        .catch(() => {});
    }
  }, [chests.length]);

  return (
    <div className="flex flex-col gap-3 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-heading font-extrabold text-sm text-text-primary">
          <Flame className="size-4 text-amber-400" />
          <span>Case Opening Arena</span>
        </div>
        <Link
          href="/chests"
          className="flex items-center gap-1 font-mono text-[11px] font-bold text-tertiary"
        >
          <span>All Cases</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {chests.slice(0, 4).map((chest) => (
          <Link
            key={chest.id}
            href={`/chests/${chest.slug}`}
            className="group relative flex w-48 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-card p-3 shadow-lg active:scale-98 transition-transform"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-surface-container mb-2">
              <Image
                src={chest.imageUrl || "/images/lootora/hub-01.jpg"}
                alt={chest.name}
                fill
                className="object-cover"
                sizes="192px"
              />
              <span className="absolute bottom-1.5 left-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-400">
                {chest.priceCoins.toLocaleString()} RC
              </span>
            </div>

            <span className="truncate text-xs font-bold text-text-primary">
              {chest.name}
            </span>
            <span className="font-mono text-[10px] text-text-muted mt-0.5">
              ${chest.priceUsd.toFixed(2)} USD
            </span>

            <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-1.5 text-[10px] font-bold uppercase text-black">
              <Sparkles className="size-3 fill-current" />
              <span>Open</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
