import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { WalletData, WalletMetric } from "../types";

export const TONE = {
  primary: { icon: "text-primary", value: "text-primary", foot: "text-primary" },
  amber: { icon: "text-tertiary-fixed-dim", value: "text-tertiary-fixed-dim", foot: "text-tertiary-fixed-dim" },
  cyan: { icon: "text-status-upcoming", value: "text-secondary", foot: "text-secondary" },
  muted: { icon: "text-text-primary", value: "text-text-primary", foot: "text-status-upcoming" },
} as const;



function MetricCard({ metric }: { metric: WalletMetric }) {
  const tone = TONE[metric.tone];
  return (
    <div className="group flex min-h-48 flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-md shadow-md transition-colors hover:bg-surface-container-high/40">
      <div className="flex items-center justify-between gap-space-sm">
        <span className="font-label-caps text-label-caps text-text-secondary uppercase">{metric.label}</span>
        {metric.live ? <span className="h-2 w-2 rounded-full bg-status-live" /> : <Icon name={metric.icon} className={cn("text-[18px]", tone.icon)} />}
      </div>
      <div>
        <div className={cn("font-data-mono-lg text-data-mono-lg font-bold", tone.value)}>{metric.value} <span className="font-body-sm font-normal text-text-muted">USD</span></div>
        <p className="mt-1 font-body-sm text-body-sm text-text-secondary">{metric.description}</p>
      </div>
      <span className={cn("font-label-badge text-label-badge", tone.foot)}>{metric.foot}</span>
    </div>
  );
}

export function WalletOverview({ data, onDeposit, onCashout }: { data: WalletData; onDeposit: () => void; onCashout: () => void }) {
  return (
    <section className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
      <div className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-xl lg:col-span-5">
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative space-y-space-sm">
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <Icon name="account_balance_wallet" className="text-[20px] text-primary" />
              <span className="font-label-caps text-label-caps text-text-secondary uppercase">Total Platform Net Equity</span>
            </div>
            <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-badge text-[10px] text-primary uppercase">Steam Connected</span>
          </div>
          <div className="flex items-baseline gap-space-sm pt-space-xs">
            <h2 className="font-display-hero text-display-hero font-bold tracking-tight text-text-primary">{data.netEquity}</h2>
            <span className="font-data-mono-md text-body-md text-text-muted">USD</span>
          </div>
          <div className="flex items-center gap-space-xs font-data-mono-md text-body-sm">
            <span className="flex items-center text-tertiary"><Icon name="trending_up" className="text-[16px]" />{data.equityChange}</span>
            <span className="text-text-muted">{data.equityNote}</span>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-space-xs pt-space-md">
          <button type="button" onClick={onDeposit} className="flex h-auto items-center justify-center gap-1 rounded-lg border-0 bg-primary px-space-xs py-space-sm font-headline-sm text-[13px] text-on-primary shadow-[0_0_16px_rgba(244,63,94,0.3)] transition-all hover:bg-primary/90"><Icon name="add_circle" className="text-[16px]" />Deposit</button>
          <button type="button" onClick={onCashout} className="flex h-auto items-center justify-center gap-1 rounded-lg border-0 bg-surface-container-high px-space-xs py-space-sm font-headline-sm text-[13px] text-text-primary transition-all hover:bg-surface-container-highest"><Icon name="bolt" className="text-[16px] text-tertiary" />Cashout</button>
          <button type="button" className="flex h-auto items-center justify-center gap-1 rounded-lg border-0 bg-surface-container-high px-space-xs py-space-sm font-headline-sm text-[13px] text-text-primary transition-all hover:bg-surface-container-highest"><Icon name="sync_alt" className="text-[16px] text-secondary" />To Steam</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:col-span-7">{data.metrics.map((metric) => <MetricCard key={metric.id} metric={metric} />)}</div>
    </section>
  );
}
