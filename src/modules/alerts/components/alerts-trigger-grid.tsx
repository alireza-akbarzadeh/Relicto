"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AlertStatus, PriceAlert } from "../types";

export const ALERT_STATUS_TONE: Record<AlertStatus, { tone: string; dot: string }> = {
  armed: { tone: "text-status-upcoming", dot: "bg-status-upcoming" },
  triggered: { tone: "text-primary", dot: "bg-primary" },
  paused: { tone: "text-text-muted", dot: "bg-text-muted" },
};

export function TriggerGrid({
  alerts,
  onToggle,
}: {
  alerts: PriceAlert[];
  onToggle: (id: string) => void;
}) {
  const t = useTranslations("alerts.triggerGrid");

  const statusLabel: Record<AlertStatus, string> = {
    armed: t("statusArmed"),
    triggered: t("statusTriggered"),
    paused: t("statusPaused"),
  };

  const headers = [
    t("thName"),
    t("thLogic"),
    t("thThreshold"),
    t("thStatus"),
    t("thYield"),
    t("thActions"),
  ];

  return (
    <section className="rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="mb-space-md flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-headline-md text-text-primary">
            {t("title")}
          </h2>
          <span className="font-label-badge text-[10px] text-text-muted uppercase">
            {t("subtitle")}
          </span>
        </div>
        <span className="font-label-badge text-[10px] text-status-live uppercase">
          {t("highConcurrency")}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="bg-surface-container-lowest font-label-caps text-[10px] text-text-muted uppercase">
            <tr>
              {headers.map((head) => (
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
                  {t("askCondition", { target: alert.target })}
                </td>
                <td className="px-3 py-3">
                  <b className="font-data-mono-md text-tertiary">{alert.target}</b>
                  <span className="block font-label-badge text-[10px] text-text-muted">
                    {t("vs", { price: alert.current })}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-label-badge text-[10px] uppercase",
                      ALERT_STATUS_TONE[alert.status].tone,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", ALERT_STATUS_TONE[alert.status].dot)} />
                    {statusLabel[alert.status]}
                  </span>
                  <span className="font-label-badge text-[10px] text-text-muted">{t("latency")}</span>
                </td>
                <td className="px-3 py-3 font-data-mono-md text-status-upcoming">
                  {t("net", { amount: (alert.id === "a1" ? 1420 : 3250).toLocaleString() })}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant={null}
                      size={null}
                      onClick={() => {
                        toast.success(t("simPassed", { item: alert.item }), {
                          description: t("simDesc"),
                        });
                      }}
                      className="inline-flex cursor-pointer items-center justify-center rounded bg-surface-container-high px-2 py-1 font-label-caps text-[10px] text-text-primary uppercase transition-colors hover:bg-surface-container-highest"
                    >
                      {t("test")}
                    </Button>
                    <Button
                      variant={null}
                      size="icon-xs"
                      onClickCapture={() => onToggle(alert.id)}
                      aria-label={t("toggleAria", { item: alert.item })}
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
