"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import type { MarketHealth } from "../../hooks/use-market-stream";
import { shortAgo, STREAM_STATE } from "../../lib/terminal-format";

/** The market stream's own vitals, measured in this browser — not a status page's claims. */
export function StreamHealth({ health, now, feedMismatches }: { health: MarketHealth; now: number; feedMismatches: number }) {
  const t = useTranslations("tracker");
  const status = STREAM_STATE[health.state];
  const rows: [string, string, string][] = [
    [t("transport"), t("sse"), "text-text-primary"],
    [t("changePush"), health.push === null ? "—" : health.push ? t("postgresListen") : t("polling5s"), health.push ? "text-status-upcoming" : "text-tertiary"],
    [t("framesReceived"), formatCount(health.frames), "text-text-primary"],
    [t("marketChanges"), formatCount(health.changes), "text-tertiary"],
    [t("lastFrame"), health.lastFrameAt ? `${shortAgo(now - health.lastFrameAt)} ${t("ago")}` : "—", "text-text-primary"],
    [t("serverLatency"), health.latencyMs === null ? "—" : `${health.latencyMs}ms`, "text-status-upcoming"],
    [t("reconnects"), formatCount(health.reconnects), "text-text-primary"],
    [t("feedMismatches"), formatCount(feedMismatches), feedMismatches ? "text-tertiary" : "text-text-primary"],
  ];

  return (
    <section className="rounded-xl border border-white/8 bg-surface-card p-space-md">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">{t("marketStream")}</h2>
        <span className={cn("flex items-center gap-1.5 font-label-badge text-[10px] uppercase", status.tone)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-2 font-data-mono-md text-[11px] text-text-secondary">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="flex justify-between">
            <span>{label}</span>
            <b className={cn("tabular-nums", tone)}>{value}</b>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded bg-surface-container-lowest p-2 font-label-badge text-[10px] text-text-muted">
        {health.simulated
          ? t("streamSimDesc")
          : t("streamRealDesc")}
      </div>
    </section>
  );
}
