import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { DelistButton } from "@/modules/sell/components/delist-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { LISTING_BADGE, TONE_TEXT } from "../../lib/tones";
import type { Listing } from "../../types";

const ACTION = "h-auto rounded-lg border-0 bg-surface-container p-space-sm transition-colors";

/** One item listed for sale, with price controls. */
export function ListingRow({ listing }: { listing: Listing }) {
  return (
    <div className="flex flex-col items-start justify-between gap-space-md rounded-xl bg-surface-card p-space-md transition-colors hover:bg-surface-container-high md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-space-md">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest p-1">
          <Image src={listing.image} alt={listing.imageAlt} width={512} height={279} sizes="64px" className="h-auto w-auto max-h-full max-w-full object-contain" />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-space-xs">
            <span className={cn("rounded px-1.5 py-0.5 font-label-badge text-[10px] font-bold uppercase", LISTING_BADGE[listing.badge.variant])}>
              {listing.badge.label}
            </span>
            <span className="font-label-badge text-label-badge text-text-muted">{listing.meta}</span>
          </div>
          <span className="truncate font-headline-sm text-headline-sm font-bold text-text-primary">{listing.name}</span>
          <span className="font-body-sm text-body-sm text-text-secondary">{listing.detail}</span>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-space-lg self-stretch md:w-auto md:self-auto">
        <div className="text-left md:text-right">
          <span className={cn("block font-headline-sm text-headline-sm font-bold", TONE_TEXT[listing.priceTone])}>{formatMoney(listing.priceUsd)}</span>
          <span className={cn("font-label-badge text-label-badge", TONE_TEXT[listing.noteTone])}>{listing.note}</span>
        </div>
        <div className="flex items-center gap-space-xs">
          <NoticeButton
            notice={{ title: `Adjusting listing price for ${listing.name}`, description: "Price editing lands with the listings API." }}
            aria-label={`Edit price for ${listing.name}`}
            className={cn(ACTION, "text-text-primary hover:bg-surface-bright")}
          >
            <Icon name="edit" className="text-[18px]" />
          </NoticeButton>
          <DelistButton
            listingId={listing.id}
            name={listing.name}
            aria-label={`Delist ${listing.name}`}
            className={cn(ACTION, "text-on-surface-variant hover:bg-status-live/20 hover:text-status-live")}
          >
            <Icon name="close" className="text-[18px]" />
          </DelistButton>
        </div>
      </div>
    </div>
  );
}
