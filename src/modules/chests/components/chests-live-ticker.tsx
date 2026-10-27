"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { soundEffects } from "@/lib/sound-effects";
import type { LiveDropItem } from "../types";

export function ChestsLiveTicker({ initialDrops }: { initialDrops: LiveDropItem[] }) {
  const [drops, setDrops] = React.useState<LiveDropItem[]>(initialDrops);
  const [muted, setMuted] = React.useState(false);

  React.useEffect(() => {
    setMuted(soundEffects.getMuted());
  }, []);

  const toggleSound = () => {
    const next = soundEffects.toggleMute();
    setMuted(next);
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "arcana":
      case "cosmic":
        return "border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] bg-rose-500/10 text-rose-300";
      case "immortal":
        return "border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] bg-amber-500/10 text-amber-300";
      case "mythical":
      case "covert":
        return "border-purple-500/50 bg-purple-500/10 text-purple-300";
      case "legendary":
        return "border-pink-500/50 bg-pink-500/10 text-pink-300";
      default:
        return "border-cyan-500/40 bg-cyan-500/10 text-cyan-300";
    }
  };

  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-border-subtle bg-surface-card/80 px-3 py-2 backdrop-blur-md">
      <div className="flex shrink-0 items-center gap-1.5 border-r border-border-subtle pr-3">
        <Sparkles className="size-3.5 text-primary animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          Live Drops
        </span>
      </div>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {drops.map((drop) => {
          const glow = getRarityGlow(drop.item.rarity);
          return (
            <Link
              key={drop.id}
              href={`/chests/${drop.chestSlug}`}
              className={`group flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1 transition-all hover:scale-105 ${glow}`}
            >
              <div className="relative size-6 shrink-0 overflow-hidden rounded">
                <Image
                  src={drop.item.imageUrl || "/images/lootora/hub-01.jpg"}
                  alt={drop.item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="24px"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="max-w-[110px] truncate text-xs font-semibold text-text-primary leading-tight">
                    {drop.item.name}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">
                    ${drop.item.valueUsd.toFixed(1)}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-text-muted leading-tight">
                  by {drop.traderHandle}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={toggleSound}
        title={muted ? "Unmute Gaming Audio" : "Mute Audio"}
        className="shrink-0 text-text-muted hover:text-text-primary"
      >
        {muted ? <VolumeX className="size-3.5 text-rose-400" /> : <Volume2 className="size-3.5 text-primary" />}
      </Button>
    </div>
  );
}
