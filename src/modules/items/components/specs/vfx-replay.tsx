"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { NoticeButton } from "@/components/notice-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import type { ItemDetail } from "../../types";

/** Clip preview of the item's signature effect plus the price-drop alert form. */
export function VfxReplay({ replay }: { replay: ItemDetail["replay"] }) {
  const [price, setPrice] = useState(replay.alertPrice);

  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      <div className="flex h-full flex-col justify-between gap-3 rounded-lg border border-border-subtle bg-surface-card p-5 shadow-xl">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs font-bold text-status-live">{replay.eyebrow}</span>
            <span className="font-data-mono-md text-[10px] text-text-muted">{replay.quality}</span>
          </div>
          <h4 className="mt-1 font-headline-sm text-sm font-bold text-text-primary">{replay.title}</h4>
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
              notice={{ title: "Clip playback", description: "VFX replays stream once the media pipeline is wired." }}
              aria-label="Play animation clip"
              className="h-12 w-12 rounded-full border-0 bg-status-live/90 text-text-primary shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-transform group-hover:scale-110 hover:bg-status-live"
            >
              <Icon name="play_arrow" className="ml-0.5 text-[24px]" />
            </NoticeButton>
          </div>
          <div className="absolute right-2 bottom-2 left-2 flex items-center justify-between rounded border border-border-subtle bg-surface-container-lowest/90 px-2 py-1 font-label-badge text-[10px] text-text-primary backdrop-blur-md">
            <span>{replay.caption}</span>
            <span className="font-bold text-emerald-400">{replay.damage}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-container p-3">
          <div className="flex items-center gap-2">
            <Icon name="notification_add" className="text-[18px] text-tertiary" />
            <span className="font-headline-sm text-xs font-bold text-text-primary">Configure Price Drop Alerts</span>
          </div>
          <p className="font-body-sm text-[11px] text-text-muted">Receive instantaneous Steam Bot webhooks or emails when listings drop.</p>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 font-data-mono-md text-xs text-text-muted">$</span>
              <Input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                aria-label="Alert me below this price"
                className="h-auto rounded border-border-subtle bg-surface-container-lowest py-1.5 pr-2 pl-6 font-data-mono-md text-xs text-text-primary focus-visible:border-tertiary focus-visible:ring-1 focus-visible:ring-tertiary md:text-xs"
              />
            </div>
            <Button
              variant={null}
              size={null}
              onClick={() => toast.success(`Ping set at $${price}`, { description: "Alerts dispatch once the notifications service is wired." })}
              className="h-auto rounded border-border-subtle bg-surface-container-high px-4 py-1.5 font-label-caps text-xs font-bold text-text-primary transition-all hover:bg-tertiary hover:text-on-tertiary-container"
            >
              SET PING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
