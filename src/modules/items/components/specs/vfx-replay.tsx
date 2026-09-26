"use client";

import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import type { ItemDetail } from "../../types";
import { PriceAlertCard } from "./price-alert-card";

/** Clip preview of the item's signature effect plus the price-drop alert form. */
export function VfxReplay({
  replay,
  itemName,
}: {
  replay: ItemDetail["replay"];
  itemName: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      <div className="flex h-full flex-col justify-between gap-3 rounded-lg border border-border-subtle bg-surface-card p-5 shadow-xl">
        {/* Catalog-built pages have no clip; the alert form stands on its own. */}
        {replay.title && (
          <>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-xs font-bold text-status-live">
                  {replay.eyebrow}
                </span>
                <span className="font-data-mono-md text-[10px] text-text-muted">
                  {replay.quality}
                </span>
              </div>
              <h4 className="mt-1 font-headline-sm text-sm font-bold text-text-primary">
                {replay.title}
              </h4>
            </div>
            <div className="group relative aspect-video w-full overflow-hidden rounded border border-border-subtle bg-surface-container-lowest shadow-inner">
              <Image
                src={replay.image}
                alt={replay.imageAlt}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-canvas-base/60 transition-all group-hover:bg-canvas-base/40">
                <NoticeButton
                  notice={{
                    title: "Clip playback",
                    description:
                      "VFX replays stream once the media pipeline is wired.",
                  }}
                  aria-label="Play animation clip"
                  className="h-12 w-12 rounded-full border-0 bg-status-live/90 text-text-primary shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-transform group-hover:scale-110 hover:bg-status-live"
                >
                  <Icon name="play_arrow" className="ml-0.5 text-[24px]" />
                </NoticeButton>
              </div>
              <div className="absolute right-2 bottom-2 left-2 flex items-center justify-between rounded border border-border-subtle bg-surface-container-lowest/90 px-2 py-1 font-label-badge text-[10px] text-text-primary backdrop-blur-md">
                <span>{replay.caption}</span>
                <span className="font-bold text-emerald-400">
                  {replay.damage}
                </span>
              </div>
            </div>
          </>
        )}
        <PriceAlertCard itemName={itemName} defaultPrice={replay.alertPrice} />
      </div>
    </div>
  );
}
