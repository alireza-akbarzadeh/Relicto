"use client";

import { useState } from "react";
import { Video, Image as ImageIcon, Volume2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ItemDetail } from "../../types";
import { getItemMedia, type ItemMediaData } from "../../data/item-media.mock";
import { useItemBuy } from "../../hooks/use-item-buy";
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
  const { buyNow, pending } = useItemBuy(item);

  const handleInstantBuy = () => {
    onOpenChange(false);
    void buyNow();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-black/80 backdrop-blur-md"
        className="w-[94vw] max-w-4xl sm:max-w-4xl border border-white/15 bg-surface-card p-0 shadow-2xl overflow-hidden rounded-2xl"
      >
        <DialogHeader className="border-b border-white/10 bg-surface-container-lowest/90 px-6 py-3.5 pr-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded bg-primary/20 px-2.5 py-1 font-label-badge text-xs font-bold text-primary uppercase">
                {media.game} · {media.hero}
              </span>
              <DialogTitle className="font-headline-sm text-base md:text-lg font-bold text-text-primary">
                {media.name} — Visual Showcase
              </DialogTitle>
            </div>
            <span className="flex items-center gap-1.5 font-data-mono-md text-xs text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Sotoon S3 Verified
            </span>
          </div>
          <DialogDescription className="hidden">
            High-definition video replay and multi-angle 3D cosmetic photography.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-white/5 bg-surface-container-lowest px-6 py-2.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setTab("video")}
              className={cn(
                "h-8 gap-2 rounded px-3 font-headline-sm text-xs uppercase transition-all",
                tab === "video"
                  ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5",
              )}
            >
              <Video className="size-4" />
              <span>In-Game Video (60fps)</span>
            </Button>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setTab("gallery")}
              className={cn(
                "h-8 gap-2 rounded px-3 font-headline-sm text-xs uppercase transition-all",
                tab === "gallery"
                  ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5",
              )}
            >
              <ImageIcon className="size-4" />
              <span>4K Gallery ({media.gallery.length})</span>
            </Button>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setTab("sfx")}
              className={cn(
                "h-8 gap-2 rounded px-3 font-headline-sm text-xs uppercase transition-all",
                tab === "sfx"
                  ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5",
              )}
            >
              <Volume2 className="size-4" />
              <span>SFX & Audio</span>
            </Button>
          </div>
          <span className="font-data-mono-md text-xs text-tertiary hidden sm:inline">1080P 60FPS REPLAY</span>
        </div>

        {/* Content Pane */}
        <div className="relative bg-black/95 p-5">
          {tab === "video" && <ItemMediaVideoPane video={media.video} />}
          {tab === "gallery" && <ItemMediaGalleryPane gallery={media.gallery} />}
          {tab === "sfx" && (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary shadow-lg shadow-tertiary/20">
                <Volume2 className="size-8 text-tertiary animate-pulse" />
              </div>
              <div>
                <h4 className="font-headline-sm text-sm font-bold text-text-primary uppercase">{media.sfx.title}</h4>
                <p className="mt-1 max-w-md font-body-sm text-xs text-text-muted">{media.sfx.description}</p>
                <span className="mt-2.5 inline-block rounded border border-tertiary/30 bg-tertiary/10 px-3 py-1 font-data-mono-md text-xs text-tertiary">
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
        <div className="flex items-center justify-between border-t border-white/10 bg-surface-container-lowest/90 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="font-data-mono-md text-base md:text-lg font-bold text-text-primary">
              ${item.price.lowestUsd.toFixed(2)} USD
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-label-badge text-[11px] font-semibold text-emerald-400">
              0-day Peer Escrow
            </span>
          </div>
          <Button
            type="button"
            disabled={pending}
            onClick={handleInstantBuy}
            className="h-9 gap-2 border-0 bg-primary px-5 font-headline-sm text-xs font-bold text-on-primary uppercase shadow-lg shadow-primary/30 hover:bg-primary/90 whitespace-nowrap"
          >
            <ShoppingBag className="size-4" />
            <span>{pending ? "Reserving..." : `Instant Buy — $${item.price.lowestUsd.toFixed(2)}`}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
