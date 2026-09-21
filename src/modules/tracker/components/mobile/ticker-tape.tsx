import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDelta, formatMoney } from "@/lib/format";
import { tickTone } from "../../lib/mobile-market";
import type { FeedTick, TrackerMobileData } from "../../mobile.types";

const LABEL: Record<FeedTick["tone"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-text-secondary",
  amber: "text-tertiary",
};

/** Scrolling price feed plus the latency / escrow / bots pill below it. */
export function TickerTape({ feed, telemetry }: Pick<TrackerMobileData, "feed" | "telemetry">) {
  return (
    <>
      <div className="no-scrollbar w-full overflow-x-auto bg-surface-container-lowest py-2">
        <div className="flex min-w-max items-center gap-3 px-4">
          <div className="flex items-center gap-1.5 rounded bg-surface-container-low px-2.5 py-1">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
            <span className="font-label-badge text-label-badge text-text-muted uppercase">FEED</span>
          </div>
          {feed.map((tick) => (
            <div key={tick.id} className="flex items-center gap-1.5 rounded bg-surface-container px-2 py-1">
              <span className={cn("font-body-sm text-body-sm font-medium", LABEL[tick.tone])}>{tick.label}</span>
              <span className="font-data-mono-md text-data-mono-md font-semibold text-text-primary">{formatMoney(tick.priceUsd)}</span>
              <span className={cn("rounded px-1 font-label-badge text-label-badge font-bold", tickTone(tick.changePct))}>{formatDelta(tick.changePct)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded bg-surface-container px-1.5 py-0.5">
              <Icon name="bolt" className="text-[14px] text-primary" />
              <span className="font-label-badge text-label-badge text-text-primary">{telemetry.latency}</span>
            </div>
            <div className="flex items-center gap-1 text-text-secondary">
              <span className="font-body-sm text-body-sm text-text-muted">Escrow:</span>
              <span className="font-data-mono-md text-data-mono-md font-medium text-text-primary">{telemetry.escrow}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-live" />
            <span className="font-label-badge text-label-badge text-primary uppercase">{telemetry.bots}</span>
          </div>
        </div>
      </div>
    </>
  );
}
