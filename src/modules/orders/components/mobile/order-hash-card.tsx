import { CopyButton } from "@/components/copy-button";
import { CountdownText } from "@/components/countdown-text";
import { Icon } from "@/components/ui/icon";
import type { TrackingMobile } from "../../mobile.types";

/** Protocol strip, transaction hash (copyable), escrow stage and the live offer-window countdown. */
export function OrderHashCard({ order, stage }: { order: TrackingMobile; stage: string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="verified_user" className="text-[18px] text-primary-container" />
          <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">{order.protocol}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded bg-surface-container-low px-2 py-0.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-upcoming" />
          <span className="font-data-mono-md text-label-badge text-status-upcoming uppercase">NODE SYNCED</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-surface-card p-space-md shadow-lg">
        <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary-container/10 blur-xl" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">TRANSACTION HASH</span>
              <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-data-mono-md text-label-badge text-secondary">{order.cipher}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md tracking-tight text-text-primary">{order.code}</span>
              <CopyButton
                value={order.code.replace(/^#/, "")}
                notice="Order ID copied"
                aria-label="Copy order ID"
                className="border-0 text-text-muted transition-transform hover:text-text-primary active:scale-95"
              >
                <Icon name="content_copy" className="text-[16px]" />
              </CopyButton>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 rounded bg-tertiary/15 px-2 py-1 font-label-badge text-label-badge tracking-wider text-tertiary uppercase">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-tertiary" />
              <span>{stage}</span>
            </span>
            <span className="mt-1 font-label-badge text-label-badge text-text-muted">ESCROW STAGE</span>
          </div>
        </div>

        <div className="mt-space-md flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm">
          <div className="flex items-center gap-2">
            <Icon name="timer" className="text-[20px] text-tertiary" />
            <span className="font-body-sm text-body-sm text-text-secondary">Steam Offer Window:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CountdownText seconds={order.offerWindowSeconds} format="timer" className="font-data-mono-lg text-data-mono-lg font-bold tracking-tight text-tertiary" />
            <span className="font-label-badge text-label-badge text-text-muted uppercase">REM</span>
          </div>
        </div>
      </div>
    </>
  );
}
