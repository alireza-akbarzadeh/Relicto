import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { WalletMetric } from "../types";
import { TONE } from "./wallet-overview";

export function MetricCard({ metric }: { metric: WalletMetric }) {
  const tone = TONE[metric.tone];

  return (
    <div className="group flex min-h-48 flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-md shadow-md transition-colors hover:bg-surface-container-high/40">
      <div className="flex items-center justify-between gap-space-sm">
        <span className="font-label-caps text-label-caps text-text-secondary uppercase">
          {metric.label}
        </span>

        {metric.live ? (
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-status-live/50" />
            <span className="relative size-2 rounded-full bg-status-live" />
          </span>
        ) : (
          <Icon
            name={metric.icon}
            className={cn("text-[18px]", tone.icon)}
          />
        )}
      </div>

      <div>
        <div
          className={cn(
            "font-data-mono-lg text-data-mono-lg font-bold",
            tone.value,
          )}
        >
          {metric.value}{" "}
          <span className="font-body-sm text-body-sm font-normal text-text-muted">
            USD
          </span>
        </div>

        <p className="mt-1 font-body-sm text-body-sm text-text-secondary">
          {metric.description}
        </p>
      </div>

      <span className={cn("font-label-badge text-label-badge", tone.foot)}>
        {metric.foot}
      </span>
    </div>
  );
}