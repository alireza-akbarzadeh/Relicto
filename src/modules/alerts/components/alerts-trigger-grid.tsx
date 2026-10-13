"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AlertStatus, PriceAlert } from "../types";

export const ALERT_STATUS_CONFIG: Record<
  AlertStatus,
  { label: string; tone: string; dot: string }
> = {
  armed: {
    label: "ARMED / PERSIST",
    tone: "text-status-upcoming",
    dot: "bg-status-upcoming",
  },
  triggered: {
    label: "ACTIVE (8/10 UNITS)",
    tone: "text-primary",
    dot: "bg-primary",
  },
  paused: { label: "PAUSED", tone: "text-text-muted", dot: "bg-text-muted" },
};

export function TriggerGrid({
  alerts,
  onToggle,
}: {
  alerts: PriceAlert[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="mb-space-md flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-headline-md text-text-primary">
            Active Algorithmic Trigger Grid
          </h2>
          <span className="font-label-badge text-[10px] text-text-muted uppercase">
            Real-time execution state &amp; historical ML ledger
          </span>
        </div>
        <span className="font-label-badge text-[10px] text-status-live uppercase">
          High Concurrency
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="bg-surface-container-lowest font-label-caps text-[10px] text-text-muted uppercase">
            <tr>
              {[
                "Rule Name & Target",
                "Logic Profile",
                "Threshold vs Current",
                "Auto-Execution Status",
                "Historical ML / Yield",
                "Actions",
              ].map((head) => (
                <th key={head} className="px-3 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr
                key={`${alert.id}-${index}`}
                className="border-t border-white/6 text-xs hover:bg-surface-container-high/30"
              >
                <td className="px-3 py-3">
                  <b className="block text-text-primary">{alert.item}</b>
                  <span className="font-label-badge text-[10px] text-text-muted">{alert.detail}</span>
                </td>
                <td className="px-3 py-3 font-data-mono-md text-text-secondary">
                  Ask &lt; {alert.target} + Float &lt; 0.012
                </td>
                <td className="px-3 py-3">
                  <b className="font-data-mono-md text-tertiary">{alert.target}</b>
                  <span className="block font-label-badge text-[10px] text-text-muted">vs {alert.current}</span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-label-badge text-[10px] uppercase",
                      ALERT_STATUS_CONFIG[alert.status].tone,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", ALERT_STATUS_CONFIG[alert.status].dot)} />
                    {ALERT_STATUS_CONFIG[alert.status].label}
                  </span>
                  <span className="font-label-badge text-[10px] text-text-muted">6ms websocket latency</span>
                </td>
                <td className="px-3 py-3 font-data-mono-md text-status-upcoming">
                  +${(alert.id === "a1" ? 1420 : 3250).toLocaleString()} NET
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant={null}
                      size={null}
                      onClick={() => {
                        toast.success(`Simulation passed: ${alert.item}`, {
                          description: "Trigger evaluation passed with 6ms simulated latency.",
                        });
                      }}
                      className="inline-flex cursor-pointer items-center justify-center rounded bg-surface-container-high px-2 py-1 font-label-caps text-[10px] text-text-primary uppercase transition-colors hover:bg-surface-container-highest"
                    >
                      Test
                    </Button>
                    <Button
                      variant={null}
                      size="icon-xs"
                      onClickCapture={() => onToggle(alert.id)}
                      aria-label={`Toggle ${alert.item}`}
                      className="bg-primary-container text-on-primary-container"
                    >
                      <Icon name="sync_alt" className="text-[13px]" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
