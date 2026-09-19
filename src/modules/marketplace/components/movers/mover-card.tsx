import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDelta, formatMoney } from "@/lib/format";
import { ACCENT_TEXT, MOVER_BADGE, MOVER_BLOB, MOVER_HOVER } from "../../lib/tones";
import type { Mover } from "../../types";

type MoverCardProps = { mover: Mover; onOpen: (mover: Mover) => void };

export function MoverCard({ mover, onOpen }: MoverCardProps) {
  const up = mover.change >= 0;
  return (
    <button
      type="button"
      onClick={() => onOpen(mover)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-surface-container-lowest p-space-md text-left shadow-xs transition-all duration-200 hover:bg-surface-container-low"
    >
      <span className={cn("pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full blur-xl transition-all", MOVER_BLOB[mover.glow])} />
      <span className="mb-space-xs flex w-full items-start justify-between">
        <span className={cn("rounded px-2 py-0.5 font-label-badge text-label-badge font-bold uppercase", MOVER_BADGE[mover.badge.accent])}>
          {mover.badge.label}
        </span>
        <span className={cn("flex items-center gap-0.5 font-label-badge text-label-badge", up ? "text-status-upcoming" : "text-error")}>
          <Icon name={up ? "trending_up" : "trending_down"} className="text-[14px]" /> {formatDelta(mover.change)}
        </span>
      </span>
      <span
        className={cn(
          "mb-1 block w-full truncate font-headline-sm text-headline-sm font-bold text-text-primary transition-colors",
          MOVER_HOVER[mover.hover],
        )}
      >
        {mover.name}
      </span>
      <span className="mb-space-sm flex items-center gap-2 font-body-sm text-body-sm text-text-muted">
        <span>{mover.subtitle}</span>
        <span>·</span>
        <span className={ACCENT_TEXT[mover.detail.accent]}>{mover.detail.label}</span>
      </span>
      <span className="mt-auto flex w-full items-baseline justify-between pt-space-xs">
        <span className="block">
          <span className="block font-label-badge text-label-badge text-text-muted uppercase">Floor</span>
          <span className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary">{formatMoney(mover.floorUsd)}</span>
        </span>
        <span className="block text-right">
          <span className="block font-label-badge text-label-badge text-text-muted uppercase">{mover.note[0]}</span>
          <span className="font-body-sm text-body-sm text-text-secondary">{mover.note[1]}</span>
        </span>
      </span>
    </button>
  );
}
