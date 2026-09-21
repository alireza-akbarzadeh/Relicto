import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import type { TrackingMobile } from "../../mobile.types";

/** The traded cosmetic: render with rarity / wear / float, price lock and the seller's trust. */
export function OrderItemCard({ item, seller }: Pick<TrackingMobile, "item" | "seller">) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-card shadow-lg">
      <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-10 bg-linear-to-t/srgb from-surface-card via-transparent to-transparent" />
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={780}
          height={352}
          sizes="100vw"
          className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 left-2 z-20 flex gap-1">
          <span className="rounded bg-primary-container px-2 py-0.5 font-label-caps text-label-caps tracking-widest text-white uppercase shadow-sm">{item.rarity}</span>
          <span className="rounded bg-surface-overlay px-2 py-0.5 font-label-caps text-label-caps text-secondary backdrop-blur-md">{item.wear}</span>
        </div>
        <div className="absolute right-2 bottom-2 z-20 flex items-center gap-1.5 rounded bg-surface-container-highest/90 px-2 py-1 backdrop-blur-md">
          <span className="font-label-badge text-label-badge text-text-muted">FLOAT:</span>
          <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">{item.float}</span>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm p-space-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-text-primary">{item.name}</h2>
            <p className="font-body-md text-body-md text-status-upcoming">{item.finish}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary">{formatMoney(item.priceUsd)}</span>
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{item.lock}</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-2.5 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container font-data-mono-md text-label-badge font-bold text-secondary">
              {seller.initials}
            </div>
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm font-semibold text-text-primary">{seller.name}</span>
              <span className="font-label-badge text-label-badge text-text-muted">{seller.since}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded bg-surface-container-high px-2 py-1">
            <Icon name="stars" className="text-[14px] text-tertiary" />
            <span className="font-data-mono-md text-label-badge font-bold text-tertiary">{seller.trust}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
