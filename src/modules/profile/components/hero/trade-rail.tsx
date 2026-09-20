import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/ui/icon";

/** Steam trade offer URL with its handshake latency and a copy shortcut. */
export function TradeRail({ tradeUrl, handshake }: { tradeUrl: string; handshake: string }) {
  return (
    <div className="mt-space-md flex flex-col items-start justify-between gap-space-sm rounded-lg bg-surface-container-low p-space-sm md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-space-sm">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-surface-container-highest text-tertiary-fixed-dim">
          <Icon name="swap_horiz" className="text-[16px]" />
        </div>
        <span className="shrink-0 font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Active Trade URL:</span>
        <code className="truncate font-data-mono-md text-body-sm text-text-secondary">{tradeUrl}</code>
      </div>
      <div className="flex shrink-0 items-center gap-space-xs self-end md:self-auto">
        <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-[11px] font-bold text-status-upcoming uppercase">{handshake}</span>
        <CopyButton
          value={tradeUrl}
          notice="Trade Offer URL copied"
          aria-label="Copy trade offer URL"
          className="inline-block h-auto rounded border-0 p-1 text-text-muted hover:bg-surface-container hover:text-text-primary"
        >
          <Icon name="content_copy" className="text-[16px]" />
        </CopyButton>
      </div>
    </div>
  );
}
