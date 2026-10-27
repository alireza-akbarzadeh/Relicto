"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Flame } from "lucide-react";
import { HubLiveDropsBar } from "./hub-live-drops-bar";
import { HubChestsHero } from "./hub-chests-hero";
import { HubChestPreviewCard } from "./hub-chest-preview-card";
import { DailyBonusDialog } from "@/modules/chests/components/daily-bonus-dialog";
import type { ChestDefinition } from "@/modules/chests/types";

type CategoryFilter = "all" | "dota2" | "cs2" | "high_roller" | "budget";

export function HubChestsShowcase({ initialChests = [] }: { initialChests?: ChestDefinition[] }) {
  const [chests, setChests] = React.useState<ChestDefinition[]>(initialChests);
  const [filter, setFilter] = React.useState<CategoryFilter>("all");
  const [dailyBonusOpen, setDailyBonusOpen] = React.useState(false);

  React.useEffect(() => {
    if (chests.length === 0) {
      fetch("/api/chests")
        .then((r) => r.json())
        .then((data) => {
          if (data.chests && data.chests.length > 0) {
            setChests(data.chests);
          }
        })
        .catch(() => {});
    }
  }, [chests.length]);

  const filteredChests = React.useMemo(() => {
    return chests.filter((c) => {
      if (!c.isActive) return false;
      if (filter === "dota2") return c.items.some((i) => i.gameId === "dota2");
      if (filter === "cs2") return c.items.some((i) => i.gameId === "cs2");
      if (filter === "high_roller") return c.priceCoins >= 1200;
      if (filter === "budget") return c.priceCoins < 1200;
      return true;
    });
  }, [chests, filter]);

  return (
    <section className="space-y-6 pt-4">
      {/* 1. Live Unboxing Drops Ticker Strip */}
      <HubLiveDropsBar />

      {/* 2. High-Energy Hero Presentation */}
      <HubChestsHero onOpenDailyBonus={() => setDailyBonusOpen(true)} />

      {/* 3. Category Filter Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-amber-400" />
          <h3 className="font-heading font-extrabold text-lg text-text-primary">
            Featured Battle Pass Chests
          </h3>
          <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-xs text-text-muted border border-white/5">
            {filteredChests.length} available
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[
            { id: "all", label: "🔥 All Cases" },
            { id: "dota2", label: "⚔️ Dota 2 Arcanas" },
            { id: "cs2", label: "🔫 CS2 Elite" },
            { id: "high_roller", label: "💎 High Roller" },
            { id: "budget", label: "⚡ Budget Spoons" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as CategoryFilter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono font-semibold transition-all shrink-0 ${
                filter === tab.id
                  ? "bg-amber-500 text-black shadow-md font-bold"
                  : "bg-surface-container text-text-secondary hover:text-text-primary hover:bg-surface-container-high border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Responsive Chests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredChests.map((chest) => (
          <HubChestPreviewCard key={chest.id} chest={chest} />
        ))}
      </div>

      {/* 5. View Full Arena Callout */}
      <div className="flex items-center justify-center pt-2">
        <Link
          href="/chests"
          className="group flex items-center gap-2 rounded-xl bg-surface-container-low px-6 py-2.5 font-mono text-xs font-bold text-text-primary border border-white/10 hover:border-amber-500/50 hover:bg-surface-container-high transition-all"
        >
          <Sparkles className="size-3.5 text-amber-400" />
          <span>View All Cases & Escalating Odds Simulator</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Daily Bonus Dialog */}
      <DailyBonusDialog
        open={dailyBonusOpen}
        onOpenChange={setDailyBonusOpen}
      />
    </section>
  );
}
