import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { ACCENT_TEXT, ART_SHADOW } from "../../lib/tones";
import type { Listing, MediaBadge } from "../../types";

const CHIP = "absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-deep/90 backdrop-blur-md font-label-badge text-[10px]";

function MediaChip({ badge }: { badge: MediaBadge }) {
  if (badge.kind === "float") {
    return (
      <div className={cn(CHIP, "text-text-primary")}>
        <span className="font-data-mono-md">Float: {badge.value}</span>
      </div>
    );
  }
  if (badge.kind === "fx") {
    return (
      <div className={cn(CHIP, ACCENT_TEXT[badge.accent])}>
        <Icon name={badge.icon} className="text-[12px]" />
        <span>{badge.label}</span>
      </div>
    );
  }
  return (
    <div className={cn(CHIP, "text-status-upcoming")}>
      <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />
      <span>{badge.label}</span>
    </div>
  );
}

/** Item artwork well with its overlay chip (escrow, float or custom effect). */
export function ListingMedia({ listing, priority }: { listing: Listing; priority?: boolean }) {
  return (
    <div className="relative mb-space-sm flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest p-2 transition-transform group-hover:scale-[1.02]">
      <Image
        src={listing.image}
        alt={listing.imageAlt}
        width={240}
        height={144}
        fetchPriority={priority ? "high" : undefined}
        className={cn("h-full w-full object-contain", ART_SHADOW[listing.glow.shadow])}
      />
      <MediaChip badge={listing.mediaBadge} />
    </div>
  );
}
