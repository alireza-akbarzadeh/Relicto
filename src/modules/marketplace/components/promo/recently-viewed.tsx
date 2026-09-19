"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { RECENTLY_VIEWED } from "../../data/listings.mock";
import { ACCENT_TEXT } from "../../lib/tones";

/** Recently viewed strip; "Clear History" empties it for the session. */
export function RecentlyViewed() {
  const [items, setItems] = useState<readonly (typeof RECENTLY_VIEWED)[number][]>(RECENTLY_VIEWED);

  return (
    <div className="w-full rounded-xl bg-surface-card/60 p-space-md shadow-xs backdrop-blur-md">
      <div className="mb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="history" className="text-[18px] text-text-muted" />
          <span className="font-label-caps text-label-caps text-text-muted uppercase">Recently Viewed Drops</span>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setItems([])}
            className="font-label-badge text-label-badge text-text-muted transition-colors hover:text-text-primary"
          >
            Clear History
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="py-2 font-body-sm text-body-sm text-text-muted">Items you open will show up here.</p>
      ) : (
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2 md:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="group flex items-center gap-space-sm rounded bg-surface-container-lowest p-2 transition-colors hover:bg-surface-container"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-container-low">
                <Image src={item.image} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-headline-sm text-[12px] font-bold text-text-primary transition-colors group-hover:text-primary">
                  {item.name}
                </div>
                <div className={cn("font-data-mono-md text-[11px] font-bold", ACCENT_TEXT[item.accent])}>{item.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
