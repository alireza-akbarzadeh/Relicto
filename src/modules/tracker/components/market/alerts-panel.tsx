import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import type { AlertStatus, PriceAlert } from "@/modules/alerts/types";

const STATUS: Record<AlertStatus, string> = { armed: "text-status-upcoming", triggered: "text-primary", paused: "text-text-muted" };

/**
 * The trader's price rules, each against its item's live floor. The stream
 * re-reads them on every market change, so "now" moves with the book.
 */
export function AlertsPanel({ alerts }: { alerts: PriceAlert[] }) {
  const armed = alerts.filter((alert) => alert.status === "armed").length;

  return (
    <section className="rounded-xl border border-white/8 bg-surface-card p-space-md">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">Live Price Alerts</h2>
        <span className="font-label-badge text-[10px] text-tertiary">{armed} ARMED</span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {alerts.length === 0 && (
          <p className="rounded bg-surface-container-lowest px-2 py-3 font-body-sm text-[11px] text-text-muted">
            No alerts yet. Set a target price and Relicto pings you the moment the floor crosses it.
          </p>
        )}
        {alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="flex items-center justify-between gap-2 rounded bg-surface-container-lowest px-2 py-2 font-data-mono-md text-[10px] text-text-secondary">
            <span className="min-w-0">
              <span className="block truncate text-text-primary">{alert.item}</span>
              <span className="tabular-nums">
                Now {alert.current} · {alert.direction === "below" ? "≤" : "≥"} {alert.target}
              </span>
            </span>
            <span className={cn("shrink-0 uppercase", STATUS[alert.status])}>{alert.status}</span>
          </div>
        ))}
      </div>
      <LinkButton
        href="/alerts"
        className="mt-3 h-auto w-full gap-1.5 rounded bg-surface-container-high py-2 font-label-caps text-[10px] text-text-primary uppercase hover:bg-surface-container-highest"
      >
        <Icon name="tune" className="text-[14px]" />
        {alerts.length ? "Manage Alerts" : "Create an Alert"}
      </LinkButton>
    </section>
  );
}
