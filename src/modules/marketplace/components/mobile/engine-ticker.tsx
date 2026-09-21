import { Icon } from "@/components/ui/icon";
import type { EngineTicker as EngineTickerData } from "../../mobile.types";

/** Liquidity pool and socket latency strip under the grid. */
export function EngineTicker({ ticker }: { ticker: EngineTickerData }) {
  return (
    <section className="flex w-full items-center justify-between gap-2 rounded-xl bg-surface-container-low px-3.5 py-2.5 shadow-inner">
      <div className="flex min-w-0 items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-status-upcoming shadow-[0_0_8px_var(--color-status-upcoming)]" />
        <div className="flex min-w-0 flex-col">
          <span className="font-label-badge text-label-badge text-text-secondary uppercase">{ticker.label}</span>
          <span className="truncate font-data-mono-md text-data-mono-md font-bold text-text-primary">{ticker.pool}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-1 text-text-secondary">
          <Icon name="bolt" className="text-[15px] text-tertiary" />
          <span className="font-data-mono-md text-[11px]">{ticker.latency}</span>
        </div>
        <div className="flex items-center gap-1 rounded bg-surface-container px-2 py-0.5 font-label-badge text-[10px] text-primary">
          <Icon name="verified_user" className="text-[12px]" />
          <span>{ticker.badge}</span>
        </div>
      </div>
    </section>
  );
}
