import { Icon } from "@/components/ui/icon";
import { formatDelta, formatMoney } from "@/lib/format";
import type { WalletMobile } from "../../mobile.types";

/** Multi-sig status chip and the portfolio balance with its liquid / escrow split. */
export function BalanceCard({ wallet }: { wallet: WalletMobile }) {
  const total = wallet.availableUsd + wallet.escrowUsd;

  return (
    <>
      <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-space-md py-space-sm shadow-xs">
        <div className="flex min-w-0 items-center gap-space-sm">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
            <Icon name="verified_user" className="text-[16px] text-secondary" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-label-badge text-label-badge text-text-secondary uppercase">{wallet.vault.label}</span>
            <span className="truncate pt-0.5 font-headline-sm text-headline-sm leading-none text-text-primary">{wallet.vault.keys}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-surface-container-highest px-2 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
          <span className="font-data-mono-md text-data-mono-md text-secondary">{wallet.vault.mode}</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl bg-surface-card p-space-md shadow-xl">
        <div className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full bg-primary-container/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-secondary-container/15 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps tracking-widest text-text-secondary uppercase">Portfolio Telemetry</span>
            <div className="flex items-center gap-1 rounded-md bg-surface-container-high/90 px-2 py-0.5">
              <Icon name={wallet.changePct < 0 ? "trending_down" : "trending_up"} className="text-[14px] text-tertiary" />
              <span className="font-data-mono-md text-data-mono-md text-tertiary">{formatDelta(wallet.changePct)}</span>
              <span className="font-label-badge text-label-badge text-text-muted">(24h)</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-headline-xl-mobile text-headline-xl-mobile tracking-tight text-text-primary">{formatMoney(total)}</span>
            <span className="font-label-caps text-label-caps text-text-muted uppercase">USD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-label-badge text-label-badge text-text-secondary">24h PnL:</span>
            <span className="font-data-mono-md text-data-mono-md text-tertiary">{wallet.pnlUsd < 0 ? "-" : "+"}{formatMoney(Math.abs(wallet.pnlUsd))}</span>
            <span className="h-1 w-1 rounded-full bg-surface-variant" />
            <span className="font-label-badge text-label-badge text-text-secondary">Steam Bot Sync:</span>
            <span className="font-data-mono-md text-data-mono-md text-text-primary">{wallet.sync}</span>
          </div>
          <div className="mt-space-xs grid grid-cols-2 gap-space-sm pt-space-xs">
            <div className="flex flex-col rounded-lg bg-surface-container-lowest/80 p-2.5 shadow-xs">
              <div className="flex items-center gap-1 text-text-secondary">
                <Icon name="lock_open" className="text-[14px] text-primary" />
                <span className="font-label-badge text-label-badge uppercase">Available Liquid</span>
              </div>
              <span className="pt-1 font-data-mono-lg text-data-mono-lg text-text-primary">{formatMoney(wallet.availableUsd)}</span>
              <span className="pt-0.5 font-label-caps text-label-caps text-text-muted">Instant Transfer Ready</span>
            </div>
            <div className="flex flex-col rounded-lg bg-surface-container-lowest/80 p-2.5 shadow-xs">
              <div className="flex items-center gap-1 text-text-secondary">
                <Icon name="hourglass_top" className="text-[14px] text-tertiary" />
                <span className="font-label-badge text-label-badge uppercase">In Valve Escrow</span>
              </div>
              <span className="pt-1 font-data-mono-lg text-data-mono-lg text-tertiary">{formatMoney(wallet.escrowUsd)}</span>
              <span className="pt-0.5 font-label-caps text-label-caps text-text-muted">{wallet.escrowNote}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
