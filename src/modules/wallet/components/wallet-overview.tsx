import { Icon } from "@/components/ui/icon";
import type { WalletData } from "../types";
import { MetricCard } from "./metric-card";
import { WalletAction, WalletActionButton } from "./wallet-action-button";

export const TONE = {
  primary: {
    icon: "text-primary",
    value: "text-primary",
    foot: "text-primary",
  },
  amber: {
    icon: "text-tertiary-fixed-dim",
    value: "text-tertiary-fixed-dim",
    foot: "text-tertiary-fixed-dim",
  },
  cyan: {
    icon: "text-status-upcoming",
    value: "text-secondary",
    foot: "text-secondary",
  },
  muted: {
    icon: "text-text-primary",
    value: "text-text-primary",
    foot: "text-status-upcoming",
  },
} as const;

export function WalletOverview({
  data,
  onDeposit,
  onCashout,
  onToSteam,
  activeAction = "deposit",
}: {
  data: WalletData;
  onDeposit: () => void;
  onCashout: () => void;
  onToSteam: () => void;
  activeAction?: WalletAction;
}) {
  return (
    <section className="grid grid-cols-1 gap-space-md lg:grid-cols-12">
      {/* Net equity */}
      <div className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-xl lg:col-span-5">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative space-y-space-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex min-w-0 items-center gap-space-xs">
              <Icon
                name="account_balance_wallet"
                className="shrink-0 text-[20px] text-primary"
              />

              <span className="truncate font-label-caps text-label-caps text-text-secondary uppercase">
                Total Platform Net Equity
              </span>
            </div>

            <span className="shrink-0 rounded-full bg-surface-container-high px-2 py-0.5 font-label-badge text-[10px] text-primary uppercase">
              Steam Connected
            </span>
          </div>

          {/* Balance */}
          <div className="flex items-baseline gap-space-sm pt-space-xs">
            <h2 className="font-display-hero text-display-hero font-bold tracking-tight text-text-primary">
              {data.netEquity}
            </h2>

            <span className="font-data-mono-md text-body-md text-text-muted">
              USD
            </span>
          </div>

          {/* Change */}
          <div className="flex flex-wrap items-center gap-space-xs font-data-mono-md text-body-sm">
            <span className="flex items-center text-tertiary">
              <Icon name="trending_up" className="text-[16px]" />
              {data.equityChange}
            </span>

            <span className="text-text-muted">{data.equityNote}</span>
          </div>
        </div>

        {/* Wallet actions */}
        <div
          className="relative grid grid-cols-3 gap-1 rounded-lg bg-surface-container-low p-1"
          role="group"
          aria-label="Wallet operations"
        >
          <WalletActionButton
            action="deposit"
            icon="add_circle"
            active={activeAction === "deposit"}
            onClick={onDeposit}
          >
            Deposit
          </WalletActionButton>

          <WalletActionButton
            action="cashout"
            icon="bolt"
            active={activeAction === "cashout"}
            onClick={onCashout}
          >
            Cash Out
          </WalletActionButton>

          <WalletActionButton
            action="steam"
            icon="sync_alt"
            active={activeAction === "steam"}
            onClick={onToSteam}
          >
            To Steam
          </WalletActionButton>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:col-span-7">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}