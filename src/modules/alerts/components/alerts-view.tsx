"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { setAlertArmed } from "../actions/rules";
import type { AlertStatus, PriceAlert } from "../types";
import { RuleBuilder } from "./alerts-rule-builder";
import { TriggerTelemetry } from "./alerts-telemetry";
import { ExecutionTerminal, Performance } from "./alerts-terminal";
import { TriggerGrid } from "./alerts-trigger-grid";

export function AlertsView({ alerts: initial }: { alerts: PriceAlert[] }) {
  const tMobile = useTranslations("alerts.mobile");
  const tBuilder = useTranslations("alerts.ruleBuilder");
  const [alerts, setAlerts] = useState(initial);
  const [paused, setPaused] = useState(false);
  const setStatus = (id: string, status: AlertStatus) =>
    setAlerts((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));

  /** Pauses or re-arms a rule, saved on the server; rolls back if that fails. */
  const toggle = (id: string) => {
    const before = alerts.find((item) => item.id === id)?.status ?? "armed";
    const next: AlertStatus = before === "paused" ? "armed" : "paused";
    setStatus(id, next);
    setAlertArmed({ id, armed: next === "armed" })
      .then(({ ok }) => {
        if (!ok) setStatus(id, before);
      })
      .catch(() => {
        setStatus(id, before);
        toast.error(tMobile("updateError"), { description: tBuilder("checkConnection") });
      });
  };

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <div className="mx-auto flex max-w-[1780px] flex-col gap-space-lg px-margin-desktop py-space-lg">
          <TriggerTelemetry paused={paused} setPaused={setPaused} />
          <RuleBuilder />
          <TriggerGrid alerts={alerts} onToggle={toggle} />
          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
            <ExecutionTerminal />
            <Performance />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
