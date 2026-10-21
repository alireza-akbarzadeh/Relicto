"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function TriggerTelemetry({
  paused,
  setPaused,
}: {
  paused: boolean;
  setPaused: (value: boolean) => void;
}) {
  const t = useTranslations("alerts.telemetry");

  const handleExport = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      status: paused ? "paused" : "streaming",
      websocketLatencyMs: 6,
      engine: "Algo V4.2",
      endpoint: "wss://stream.relicto.gg/v1/triggers",
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relicto-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("exportSuccess"), { description: t("exportDesc") });
  };

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col justify-between gap-space-md xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-space-sm font-label-badge text-label-badge text-text-muted">
          <span className="text-text-secondary uppercase">{t("portal")}</span>
          <span className="font-bold tracking-wider text-primary uppercase">{t("engineTitle")}</span>
          <span className="flex items-center gap-1 rounded bg-surface-container-low px-space-sm py-space-xs font-data-mono-md text-data-mono-md font-bold text-primary">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
            {t("streamOnline")}
          </span>
        </div>
        <div className="flex flex-wrap gap-space-sm">
          <Button
            variant={null}
            size={null}
            onClick={() => setPaused(!paused)}
            className="h-auto gap-1 rounded bg-surface-container px-space-md py-space-xs font-label-caps text-label-caps text-text-secondary uppercase"
          >
            <Icon name={paused ? "play_arrow" : "3d_rotation"} className="text-[16px] text-tertiary" />
            {paused ? t("resumeAll") : t("pauseAll")}
          </Button>
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={handleExport}
            className="inline-flex h-auto cursor-pointer items-center gap-1 rounded bg-surface-container px-space-md py-space-xs font-label-caps text-label-caps text-text-secondary uppercase transition-colors hover:bg-surface-container-high hover:text-text-primary"
          >
            <Icon name="download" className="text-[16px] text-status-upcoming" />
            <span>{t("exportLogs")}</span>
          </Button>
          <a
            href="#rule-builder"
            className="flex items-center gap-1 rounded bg-primary-container px-space-md py-space-xs font-label-caps text-label-caps text-on-primary-container uppercase"
          >
            <Icon name="add_circle" className="text-[18px]" />
            {t("createRule")}
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-space-sm md:grid-cols-3 xl:grid-cols-5">
        {[
          [t("activeRuleSets"), "18", t("allVerified"), "text-text-primary"],
          [t("sniperBotsArmed"), "4 UNITS", t("escrowReady"), "text-primary"],
          [t("vaultLiquidity"), "$64,800.00", t("usdtPool"), "text-tertiary"],
          [t("steamUptime"), "99.99%", t("node"), "text-text-primary"],
          [t("triggerLatency"), "6ms", t("highFrequency"), "text-tertiary"],
        ].map(([label, value, note, tone]) => (
          <div key={label} className="rounded-lg bg-surface-card p-space-md shadow-sm">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{label}</span>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <b className={`font-data-mono-lg text-data-mono-lg ${tone}`}>{value}</b>
              <span className="rounded bg-surface-container-low px-1.5 py-0.5 font-label-badge text-[9px] text-text-secondary">
                {note}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          t("filterAll"),
          t("filterSniper"),
          t("filterArbitrage"),
          t("filterFloat"),
          t("filterVolume"),
        ].map((item, index) => (
          <Button
            key={item}
            variant={null}
            size={null}
            className={cn(
              "h-auto shrink-0 rounded px-space-md py-space-xs font-label-caps text-label-caps uppercase",
              index === 0
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container text-text-secondary",
            )}
          >
            {item}
          </Button>
        ))}
      </div>
    </section>
  );
}
