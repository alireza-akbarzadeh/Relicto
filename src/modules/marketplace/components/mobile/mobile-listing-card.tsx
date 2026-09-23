"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useWatchlist } from "@/modules/relicto/state/watchlist-provider";
import { formatDelta, formatMoney } from "@/lib/format";
import { useMobileListingAction } from "../../hooks/use-mobile-listing-action";
import { changeTone } from "../../lib/mobile-filters";
import type { ListingAction, ListingTagTone, MobileListing } from "../../mobile.types";

const TAG: Record<ListingTagTone, string> = {
  plain: "bg-surface-container-low text-secondary",
  hot: "bg-primary-container/20 font-bold text-primary-container",
  gold: "bg-tertiary-container/30 text-tertiary",
  muted: "bg-surface-container-low text-text-secondary",
  indigo: "bg-secondary-container/40 text-secondary",
  contraband: "bg-error-container/40 font-bold text-error",
};

const ACTION: Record<ListingAction, { label: string; icon: "flash_on" | "swap_horiz" | "visibility" }> = {
  escrow: { label: "Quick Escrow", icon: "flash_on" },
  trade: { label: "Trade Instant", icon: "swap_horiz" },
  inspect: { label: "Inspect 3D", icon: "visibility" },
};

/** Two-column market card: tag, bookmark, render, price delta and one action. */
export function MobileListingCard({ listing }: { listing: MobileListing }) {
  const { isWatched, toggle } = useWatchlist();
  const act = useMobileListingAction(listing);
  const saved = isWatched(listing.slug);
  const action = ACTION[listing.action];
  const href = `/items/${listing.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-container p-2.5 shadow-xs">
      <div className="mb-1 flex w-full items-center justify-between">
        <span className={cn("rounded px-1.5 py-0.5 font-label-badge text-[10px] uppercase", TAG[listing.tagTone])}>{listing.tag}</span>
        <Button
          variant={null}
          size={null}
          aria-label={saved ? `Remove ${listing.name} from watchlist` : `Bookmark ${listing.name}`}
          aria-pressed={saved}
          onClick={() => toggle(listing.slug, listing.name)}
          className={cn("h-6 w-6 rounded border-0 transition-colors", saved ? "text-primary" : "text-text-muted hover:text-primary")}
        >
          <Icon name="favorite" filled={saved} className="text-[16px]" />
        </Button>
      </div>

      <Link href={href} className="relative my-1 flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest">
        <Image src={listing.image} alt={listing.imageAlt} width={320} height={224} sizes="50vw" className="h-full w-full object-contain p-2" />
        <span
          className={cn(
            "absolute bottom-1 left-1.5 rounded bg-surface-deep/90 px-1 font-data-mono-md text-[10px]",
            listing.chipTone === "amber" ? "text-tertiary" : "text-text-secondary",
          )}
        >
          {listing.chip}
        </span>
      </Link>

      <Link href={href} className="mt-1 flex min-w-0 flex-col">
        <span className="truncate font-headline-sm text-headline-sm text-text-primary">{listing.name}</span>
        <span className="truncate font-body-sm text-body-sm text-text-secondary">{listing.subtitle}</span>
      </Link>

      <div className="mt-2 flex items-baseline justify-between pt-1.5">
        <span className="font-data-mono-lg text-data-mono-lg text-text-primary">{formatMoney(listing.priceUsd)}</span>
        <span className={cn("font-data-mono-md text-[11px] font-bold", changeTone(listing.changePct))}>{formatDelta(listing.changePct)}</span>
      </div>

      <Button
        variant={null}
        size={null}
        onClick={act}
        className={cn(
          "mt-2 h-8 w-full gap-1 rounded-lg border-0 font-label-caps text-label-caps font-bold uppercase transition-all active:scale-[0.98]",
          listing.featured
            ? "bg-primary text-on-primary shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            : "bg-surface-container-high text-text-primary hover:bg-primary hover:text-on-primary",
        )}
      >
        <Icon name={action.icon} className="text-[15px]" />
        <span>{action.label}</span>
      </Button>
    </article>
  );
}
