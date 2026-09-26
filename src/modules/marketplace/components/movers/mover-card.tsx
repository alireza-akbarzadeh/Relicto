import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDelta, formatMoney } from "@/lib/format";
import {
  ACCENT_TEXT,
  MOVER_BADGE,
  MOVER_BLOB,
  MOVER_HOVER,
} from "../../lib/tones";
import type { Mover } from "../../types";

type MoverCardProps = {
  mover: Mover;
  onOpen: (mover: Mover) => void;
};

export function MoverCard({ mover, onOpen }: MoverCardProps) {
  const up = mover.change >= 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(mover)}
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl",
        "border border-outline-variant/25 bg-surface-card",
        "p-space-md text-left shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/25",
        "hover:bg-surface-container hover:shadow-lg",
      )}
    >
      {/* Ambient glow */}
      <span
        className={cn(
          "pointer-events-none absolute -top-12 -right-12",
          "h-32 w-32 rounded-full blur-3xl opacity-40",
          "transition-opacity duration-300 group-hover:opacity-70",
          MOVER_BLOB[mover.glow],
        )}
      />

      {/* Header */}
      <span className="relative z-10 mb-space-md flex w-full items-center justify-between gap-space-sm">
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-1",
            "font-label-badge text-label-badge font-bold tracking-wider uppercase",
            MOVER_BADGE[mover.badge.accent],
          )}
        >
          {mover.badge.label}
        </span>

        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-md px-2 py-1",
            "font-data-mono-md text-[11px] font-bold",
            up
              ? "bg-status-upcoming/10 text-status-upcoming"
              : "bg-error/10 text-error",
          )}
        >
          <Icon
            name={up ? "trending_up" : "trending_down"}
            className="text-[14px]"
          />
          {formatDelta(mover.change)}
        </span>
      </span>

      {/* Identity */}
      <span className="relative z-10 min-w-0">
        <span
          className={cn(
            "block truncate",
            "font-headline-sm text-headline-sm font-bold text-text-primary",
            "transition-colors duration-200",
            MOVER_HOVER[mover.hover],
          )}
        >
          {mover.name}
        </span>

        <span className="mt-1 flex min-w-0 items-center gap-1.5 font-body-sm text-body-sm text-text-muted">
          <span className="truncate">{mover.subtitle}</span>

          <span className="shrink-0 text-text-muted/40">•</span>

          <span
            className={cn(
              "shrink-0",
              ACCENT_TEXT[mover.detail.accent],
            )}
          >
            {mover.detail.label}
          </span>
        </span>
      </span>

      {/* Market data */}
      <span
        className={cn(
          "relative z-10 mt-space-md flex items-end justify-between gap-space-md",
          "rounded-xl border border-outline-variant/20",
          "bg-surface-container-lowest/70 p-space-sm",
        )}
      >
        <span className="min-w-0">
          <span className="mb-0.5 block font-label-badge text-[9px] font-semibold tracking-widest text-text-muted uppercase">
            Floor
          </span>

          <span className="block truncate font-data-mono-lg text-data-mono-lg font-bold text-tertiary">
            {formatMoney(mover.floorUsd)}
          </span>
        </span>

        <span className="min-w-0 text-right">
          <span className="mb-0.5 block truncate font-label-badge text-[9px] font-semibold tracking-widest text-text-muted uppercase">
            {mover.note[0]}
          </span>

          <span className="block truncate font-body-sm text-body-sm text-text-secondary">
            {mover.note[1]}
          </span>
        </span>
      </span>

      {/* Bottom interaction hint */}
      <span className="relative z-10 mt-space-sm flex items-center justify-between text-[10px] font-semibold tracking-wider text-text-muted/60 uppercase transition-colors group-hover:text-text-muted">
        <span>Market movement</span>

        <Icon
          name="arrow_forward"
          className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </button>
  );
}
