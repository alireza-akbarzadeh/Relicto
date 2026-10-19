"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useQueryState } from "nuqs";
import { itemSearchParams } from "../../lib/search-params";
import { BADGE_WEIGHT, RARITY } from "../../lib/tones";
import type { ItemDetail } from "../../types";
import { ItemMediaDialog } from "./item-media-dialog";

/** Item render with rarity chips, kill counter, inspect modes, and rich video/image media dialog. */
export function ItemViewer({ item }: { item: ItemDetail }) {
  const [mode, setMode] = useQueryState("view", itemSearchParams.view.withOptions({ history: "replace", clearOnDefault: true }));
  const [mediaOpen, setMediaOpen] = useState(false);

  const handleInspectInGame = () => {
    const inspectUrl = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20${encodeURIComponent(item.slug)}`;
    window.location.href = inspectUrl;
    toast.success("Dispatched Steam in-game inspect", { description: "Launching client preview protocol..." });
  };

  const handleModeClick = (id: typeof mode) => {
    void setMode(id);
    if (id === "animations" || id === "equipped") {
      setMediaOpen(true);
    }
  };

  return (
    <>
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
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={handleInspectInGame}
              aria-label="Inspect in game"
              className="flex h-auto cursor-pointer items-center justify-center rounded border border-border-subtle bg-surface-container-lowest/90 p-2 text-text-secondary transition-all hover:bg-surface-container hover:text-tertiary focus-visible:outline-hidden"
            >
              <Icon name="open_in_new" className="text-[18px]" />
            </Button>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setMediaOpen(true)}
              aria-label="Open 4K Media & Video Showcase"
              title="Open 4K Media & Video Showcase"
              className="flex h-auto cursor-pointer items-center justify-center rounded border border-border-subtle bg-surface-container-lowest/90 p-2 text-text-secondary transition-all hover:bg-surface-container hover:text-text-primary focus-visible:outline-hidden"
            >
              <Icon name="fullscreen" className="text-[18px]" />
            </Button>
          </div>
        </div>

        {/* Center hero visual with click to open Media Showcase */}
        <div
          onClick={() => setMediaOpen(true)}
          className="relative my-auto flex h-full w-full cursor-pointer items-center justify-center"
        >
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

          {/* Hover prompt pill */}
          <div className="absolute inset-0 z-15 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-surface-container-lowest/95 px-3.5 py-1.5 font-headline-sm text-xs font-bold text-text-primary shadow-2xl backdrop-blur-md">
              <Icon name="play_circle" className="text-[16px] text-primary" />
              <span>Watch 60fps VFX & 4K Gallery</span>
            </span>
          </div>

          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded border border-border-subtle bg-surface-container-lowest/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <Icon name="3d_rotation" className="animate-spin text-[16px] text-tertiary [animation-duration:10s]" />
            <span className="font-label-badge text-[10px] text-text-secondary uppercase">{item.hero.spatialNote}</span>
          </div>
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded border border-border-subtle bg-surface-container-lowest/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
            <Icon name="diamond" className="text-[14px] text-pink-400" />
            <span className="font-label-badge text-[10px] font-bold text-pink-400 uppercase">{item.hero.kills}</span>
          </div>
        </div>

        <div className="z-20 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {item.inspectModes.map(({ id, label }) => (
              <Button
                key={id}
                variant={null}
                size={null}
                onClick={() => handleModeClick(id)}
                aria-pressed={mode === id}
                className={cn(
                  "h-auto rounded border border-border-subtle bg-surface-container-lowest/90 px-3 py-1 font-headline-sm text-xs uppercase transition-all",
                  mode === id ? "border-border-tactical text-tertiary shadow-sm" : "text-text-muted hover:text-text-primary",
                )}
              >
                {label}
              </Button>
            ))}
          </div>
          <span className="font-data-mono-md text-[11px] text-text-muted">{item.classId ? `ID #${item.classId}` : ""}</span>
        </div>
      </div>

      <ItemMediaDialog open={mediaOpen} onOpenChange={setMediaOpen} item={item} />
    </>
  );
}
