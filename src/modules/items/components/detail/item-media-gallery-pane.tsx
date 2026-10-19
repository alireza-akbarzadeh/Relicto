"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { MediaImage } from "../../data/item-media.mock";

export function ItemMediaGalleryPane({ gallery }: { gallery: MediaImage[] }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const currentImage = gallery[galleryIndex] || gallery[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-surface-container-lowest">
        <Image src={currentImage.url} alt={currentImage.title} fill className="object-contain" priority />
        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded border border-white/10 bg-black/80 px-3 py-1.5 backdrop-blur-md">
          <div>
            <h5 className="font-headline-sm text-xs font-bold text-text-primary">{currentImage.title}</h5>
            <p className="font-body-sm text-[10px] text-text-muted">{currentImage.caption}</p>
          </div>
          <span className="font-data-mono-md text-[10px] text-primary">
            {galleryIndex + 1} / {gallery.length}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {gallery.map((img, idx) => (
          <Button
            key={img.url}
            type="button"
            variant={null}
            size={null}
            onClick={() => setGalleryIndex(idx)}
            className={cn(
              "relative h-14 w-20 shrink-0 overflow-hidden rounded border transition-all",
              galleryIndex === idx ? "border-primary ring-2 ring-primary/40 scale-105" : "border-white/10 opacity-60 hover:opacity-100",
            )}
          >
            <Image src={img.url} alt={img.title} fill className="object-cover" />
          </Button>
        ))}
      </div>
    </div>
  );
}
