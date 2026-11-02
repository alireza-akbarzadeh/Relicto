"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { soundEffects } from "@/lib/sound-effects";
import type { LiveDropItem } from "@/modules/chests/types";

const RARITY_BORDERS: Record<string, string> = {
  common: "border-slate-500/40 shadow-slate-500/10",
  rare: "border-sky-500/50 shadow-sky-500/20",
  mythical: "border-purple-500/60 shadow-purple-500/20",
  immortal: "border-amber-400/80 shadow-amber-500/30",
  arcana: "border-rose-500/90 shadow-rose-500/40",
  covert: "border-red-500/80 shadow-red-500/30",
  cosmic: "border-fuchsia-400/90 shadow-fuchsia-500/40",
};

export function HubLiveDropsBar({ initialDrops = [] }: { initialDrops?: LiveDropItem[] }) {
  const [drops, setDrops] = React.useState<LiveDropItem[]>(initialDrops);
  const [muted, setMuted] = React.useState(false);

  React.useEffect(() => {
    setMuted(soundEffects.getMuted());

    // If no initial drops, fetch from live ticker API
    if (drops.length === 0) {
      fetch("/api/chests", { priority: "low" })
        .then((r) => r.json())
        .then((data) => {
          if (data.liveDrops && data.liveDrops.length > 0) {
            setDrops(data.liveDrops);
          }
        })
        .catch(() => {});
    }

    const fetchDrops = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      fetch("/api/chests", { priority: "low" })
        .then((r) => r.json())
        .then((data) => {
          if (data.liveDrops && data.liveDrops.length > 0) {
            setDrops(data.liveDrops);
          }
        })
        .catch(() => {});
    };

    const interval = setInterval(fetchDrops, 12000);
    document.addEventListener("visibilitychange", fetchDrops);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", fetchDrops);
    };
  }, [drops.length]);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-surface-deep/90 p-2.5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-live" />
          </span>
          <span className="font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-amber-400" />
            Dotaboom Live Unboxing Feed
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-text-muted px-2 py-0.5 rounded bg-surface-container border border-white/5">
            <ShieldCheck className="size-3 text-secondary" />
            100% Provably Fair
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => {
              const next = soundEffects.toggleMute();
              setMuted(next);
            }}
            title={muted ? "Unmute drop sounds" : "Mute drop sounds"}
            className="text-text-muted hover:text-text-primary"
          >
            {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-amber-400" />}
          </Button>
          <Link
            href="/chests"
            className="text-[10px] font-mono text-tertiary hover:underline uppercase tracking-wider"
          >
            All Drops →
          </Link>
        </div>
      </div>

      {/* Horizontal Live Drops Scroller */}
      <div className="flex items-center gap-2.5 overflow-x-auto pt-2 pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
        {drops.slice(0, 10).map((drop) => {
          const borderClass = RARITY_BORDERS[drop.item.rarity] ?? "border-white/20";
          return (
            <Link
              key={drop.id}
              href={`/chests/${drop.chestSlug}`}
              className={`group flex items-center gap-2.5 shrink-0 rounded-xl bg-surface-container-low/70 px-3 py-1.5 border transition-all hover:bg-surface-container-high/90 hover:scale-[1.02] ${borderClass}`}
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                <Image
                  src={drop.item.imageUrl || "/images/lootora/hub-01.jpg"}
                  alt={drop.item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="40px"
                />
              </div>

              <div className="flex flex-col min-w-0 pr-1">
                <span className="truncate max-w-[120px] text-xs font-bold text-text-primary group-hover:text-amber-400 transition-colors">
                  {drop.item.name}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">${drop.item.valueUsd.toFixed(2)}</span>
                  <span className="text-text-muted truncate max-w-[65px]">@{drop.traderHandle}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
