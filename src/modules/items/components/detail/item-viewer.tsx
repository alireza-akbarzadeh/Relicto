"use client";

import { useState } from "react";
import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { BADGE_WEIGHT, RARITY } from "../../lib/tones";
import type { ItemDetail, InspectMode } from "../../types";

/** Item render with rarity chips, kill counter and the inspect-mode switch. */
export function ItemViewer({ item }: { item: ItemDetail }) {
  const [mode, setMode] = useState<InspectMode>(item.inspectModes[0].id);

  return (
    <div className="group relative flex aspect-4/3 w-full flex-col justify-between overflow-hidden rounded-lg border border-border-subtle bg-surface-card p-4 shadow-2xl">
      <div className="z-20 flex w-full items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {item.badges.map((badge) => (
            <span key={badge.label} className={cn("rounded px-2.5 py-1", RARITY[badge.variant], BADGE_WEIGHT[badge.variant])}>
              {badge.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <NoticeButton
            notice={{ title: "Steam deep link", description: "Opens the in-game inspector once Steam auth is wired." }}
            aria-label="Inspect in game"
            className="h-auto rounded border-border-subtle bg-surface-container-lowest/90 p-2 text-text-secondary transition-all hover:bg-surface-container hover:text-tertiary"
          >
            <Icon name="open_in_new" className="text-[18px]" />
          </NoticeButton>
          <NoticeButton
            notice={{ title: "High-res inspector", description: "The fullscreen 3D viewer ships with the asset pipeline." }}
            aria-label="Fullscreen 3D view"
            className="h-auto rounded border-border-subtle bg-surface-container-lowest/90 p-2 text-text-secondary transition-all hover:bg-surface-container hover:text-text-primary"
          >
            <Icon name="fullscreen" className="text-[18px]" />
          </NoticeButton>
        </div>
      </div>
      <div className="relative my-auto flex h-full w-full items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-radial from-cyan-900/20 via-transparent to-transparent" />
        <Image
          src={item.hero.image}
          alt={item.hero.imageAlt}
          width={512}
          height={279}
          sizes="(min-width: 1024px) 620px, 100vw"
          fetchPriority="high"
          className="relative z-10 h-auto max-h-full w-auto max-w-full object-contain drop-shadow-[0_0_24px_rgba(6,182,212,0.3)] transition-transform duration-500 select-none group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded border border-border-subtle bg-surface-container-lowest/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <Icon name="3d_rotation" className="animate-spin text-[16px] text-tertiary [animation-duration:10s]" />
          <span className="font-label-badge text-[10px] text-text-secondary uppercase">{item.hero.spatialNote}</span>
        </div>
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded border border-border-subtle bg-surface-container-lowest/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
          <Icon name="diamond" className="text-[14px] text-pink-400" />
          <span className="font-data-mono-md text-[11px] font-medium text-text-primary">{item.hero.kills}</span>
        </div>
      </div>
      <div className="z-20 flex w-full items-center justify-center pt-2">
        <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-container-lowest/95 p-1 backdrop-blur-xl">
          {item.inspectModes.map((option) => (
            <Button
              key={option.id}
              variant={null}
              size={null}
              onClick={() => setMode(option.id)}
              aria-pressed={mode === option.id}
              className={cn(
                "h-auto rounded border-0 px-3 py-1 font-label-caps text-xs transition-all",
                mode === option.id
                  ? "bg-surface-container-high font-bold text-tertiary shadow-xs"
                  : "font-normal text-text-muted hover:bg-surface-container hover:text-text-primary",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
