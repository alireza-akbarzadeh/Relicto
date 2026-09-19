import { RefreshCw, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { formatDelta, formatMoney } from "@/lib/format";
import type { HubPulse } from "../../types";
import { HubBreadcrumbs } from "./hub-breadcrumbs";

const PILL = "flex items-center rounded-md border border-border-dark bg-surface-card px-3 py-1";
const STAT_LABEL = "font-mono text-[9px] text-text-muted uppercase";

function LiquidityBanner({ pulse }: { pulse: HubPulse }) {
  return (
    <div className="flex items-center gap-6 rounded-lg border border-border-dark bg-surface-card px-4 py-2">
      <div className="flex flex-col">
        <span className={STAT_LABEL}>Tournament Economy Liquidity</span>
        <span className="font-mono text-sm font-bold tracking-tight text-tertiary">{formatMoney(pulse.liquidityUsd)} USD</span>
      </div>
      <div className="h-6 w-px bg-border-dark" />
      <div className="flex flex-col">
        <span className={STAT_LABEL}>Volatility Vector</span>
        <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary">
          <TrendingUp className="size-3.5" /> {formatDelta(pulse.volatilityPct)} (24H)
        </span>
      </div>
    </div>
  );
}

/** Breadcrumbs, live event status, game switcher and the liquidity index. */
export function HubSubbar({ pulse, switcher }: { pulse: HubPulse; switcher: ReactNode }) {
  return (
    <div className="border-b border-border-dark bg-[#12151e]/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs leading-4">
          <HubBreadcrumbs />
          <div className="flex items-center gap-3">
            <div className={`${PILL} gap-2`}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-status-live" />
              <span className="font-mono text-[10px] font-semibold tracking-wider text-white uppercase">{pulse.event}</span>
            </div>
            <div className={`${PILL} gap-1.5 text-text-secondary`}>
              <RefreshCw className="size-3 text-status-upcoming" />
              <span className="font-mono text-[10px] tracking-wider text-text-secondary">VALVE SYNC: {pulse.syncedAgo} AGO</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-1 lg:flex-row lg:items-center">
          {switcher}
          <LiquidityBanner pulse={pulse} />
        </div>
      </div>
    </div>
  );
}
