"use client";

import { useState } from "react";
import { Video, Image as ImageIcon, Volume2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { getItemMedia, type ItemMediaData } from "../../data/item-media.mock";
import type { ItemDetail } from "../../types";
import { ItemMediaGalleryPane } from "./item-media-gallery-pane";
import { ItemMediaVideoPane } from "./item-media-video-pane";

export function ItemMediaDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemDetail;
}) {
  const media: ItemMediaData = getItemMedia(item);
  const [tab, setTab] = useState<"video" | "gallery" | "sfx">("video");

  const handleInstantBuy = () => {
    toast.success(`Reserved ${item.name} ($${item.price.lowestUsd.toFixed(2)})`, {
      description: "Added to instant escrow checkout queue.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-white/10 bg-surface-card p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="border-b border-white/10 bg-surface-container-lowest/90 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary/20 px-2 py-0.5 font-label-badge text-[10px] font-bold text-primary uppercase">
                {media.game} · {media.hero}
              </span>
              <DialogTitle className="font-headline-sm text-base font-bold text-text-primary">
                {media.name} — Visual Showcase
              </DialogTitle>
            </div>
            <span className="flex items-center gap-1 font-data-mono-md text-[10px] text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sotoon S3 Verified
            </span>
          </div>
          <DialogDescription className="hidden">
            High-definition video replay and multi-angle 3D cosmetic photography.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-white/5 bg-surface-container-lowest px-5 py-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setTab("video")}
              className={cn(
                "h-7 gap-1.5 rounded px-2.5 font-headline-sm text-xs uppercase transition-all",
                tab === "video" ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20" : "text-text-muted hover:text-text-primary",
              )}
            >
              <Video className="size-3.5" />
              <span>In-Game Video (60fps)</span>
            </Button>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setTab("gallery")}
              className={cn(
                "h-7 gap-1.5 rounded px-2.5 font-headline-sm text-xs uppercase transition-all",
                tab === "gallery" ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20" : "text-text-muted hover:text-text-primary",
              )}
            >
              <ImageIcon className="size-3.5" />
              <span>4K Gallery ({media.gallery.length})</span>
            </Button>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setTab("sfx")}
              className={cn(
                "h-7 gap-1.5 rounded px-2.5 font-headline-sm text-xs uppercase transition-all",
                tab === "sfx" ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20" : "text-text-muted hover:text-text-primary",
              )}
            >
              <Volume2 className="size-3.5" />
              <span>SFX & Audio</span>
            </Button>
          </div>
          <span className="font-data-mono-md text-[11px] text-tertiary">1080P PRO REPLAY</span>
        </div>

        {/* Content Pane */}
        <div className="relative bg-black p-4">
          {tab === "video" && <ItemMediaVideoPane video={media.video} />}
          {tab === "gallery" && <ItemMediaGalleryPane gallery={media.gallery} />}
          {tab === "sfx" && (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary shadow-lg shadow-tertiary/20">
                <Volume2 className="size-8 text-tertiary animate-pulse" />
              </div>
              <div>
                <h4 className="font-headline-sm text-sm font-bold text-text-primary uppercase">{media.sfx.title}</h4>
                <p className="mt-1 max-w-md font-body-sm text-xs text-text-muted">{media.sfx.description}</p>
                <span className="mt-2 inline-block rounded border border-tertiary/30 bg-tertiary/10 px-2.5 py-1 font-data-mono-md text-[11px] text-tertiary">
                  Audio Fidelity: {media.sfx.frequency}
                </span>
              </div>
              <Button
                type="button"
                onClick={() => toast.info(`Auditioned SFX trigger for ${item.name}`)}
                className="h-8 gap-1.5 border-0 bg-tertiary px-4 font-headline-sm text-xs font-bold text-canvas-base uppercase shadow-md shadow-tertiary/30 hover:bg-tertiary/90"
              >
                <Icon name="play_arrow" className="text-[16px]" />
                <span>Audition In-Game SFX</span>
              </Button>
            </div>
          )}
        </div>

        {/* Purchase Footer Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-surface-container-lowest/90 px-5 py-3">
          <div>
            <span className="font-data-mono-md text-base font-bold text-text-primary">
              ${item.price.lowestUsd.toFixed(2)} USD
            </span>
            <span className="ml-2 font-label-badge text-[10px] text-emerald-400">0-day Escrow</span>
          </div>
          <Button
            type="button"
            onClick={handleInstantBuy}
            className="h-8 gap-1.5 border-0 bg-primary px-4 font-headline-sm text-xs font-bold text-on-primary uppercase shadow-md shadow-primary/30 hover:bg-primary/90"
          >
            <ShoppingBag className="size-3.5" />
            <span>Instant Buy — ${item.price.lowestUsd.toFixed(2)}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
