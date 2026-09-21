import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { formatSpread } from "../../lib/mobile-market";
import type { DepthLevel } from "../../mobile.types";

type Side = "bid" | "ask";

function Column({ side, levels }: { side: Side; levels: DepthLevel[] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-surface-container-low p-2">
      <div className="flex justify-between font-label-badge text-label-badge text-text-muted uppercase">
        <span>{side === "bid" ? "Market / Bid" : "Ask / Market"}</span>
        <span>Price</span>
      </div>
      {levels.map((level, index) => {
        const best = index === 0;
        return (
          <div
            key={level.venue}
            className={cn(
              "flex items-center justify-between rounded px-1.5 py-1",
              best && (side === "bid" ? "bg-tertiary-container/10" : "bg-error-container/20"),
            )}
          >
            <span className={cn("truncate font-body-sm text-body-sm", best && side === "ask" ? "font-medium text-primary" : "text-text-secondary")}>
              {level.venue}
            </span>
            <span
              className={cn(
                "font-data-mono-md text-data-mono-md",
                best ? (side === "bid" ? "font-bold text-tertiary" : "font-bold text-primary") : "text-text-primary",
              )}
            >
              {formatMoney(level.priceUsd)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Best three bids and asks across venues, with the live spread. */
export function DepthBook({ bids, asks }: { bids: DepthLevel[]; asks: DepthLevel[] }) {
  return (
    <div className="px-4">
      <div className="flex flex-col gap-2 rounded-xl bg-surface-container p-3 shadow-lg">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1">
            <Icon name="waterfall_chart" className="text-[16px] text-text-secondary" />
            <span className="font-label-caps text-label-caps text-text-primary uppercase">Live Depth Book</span>
          </div>
          <div className="rounded bg-surface-container-high px-2 py-0.5 font-label-badge text-label-badge text-tertiary">
            Spread: <strong>{formatSpread(bids, asks)}</strong>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Column side="bid" levels={bids} />
          <Column side="ask" levels={asks} />
        </div>
      </div>
    </div>
  );
}
