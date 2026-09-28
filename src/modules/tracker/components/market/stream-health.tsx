"use client";

import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import type { MarketHealth } from "../../hooks/use-market-stream";
import { shortAgo, STREAM_STATE } from "../../lib/terminal-format";

/** The market stream's own vitals, measured in this browser — not a status page's claims. */
export function StreamHealth({ health, now, feedMismatches }: { health: MarketHealth; now: number; feedMismatches: number }) {
  const status = STREAM_STATE[health.state];
  const rows: [string, string, string][] = [
    ["Transport", "Server-Sent Events", "text-text-primary"],
    ["Change push", health.push === null ? "—" : health.push ? "Postgres LISTEN" : "Polling every 5s", health.push ? "text-status-upcoming" : "text-tertiary"],
    ["Frames received", formatCount(health.frames), "text-text-primary"],
    ["Market changes seen", formatCount(health.changes), "text-tertiary"],
    ["Last frame", health.lastFrameAt ? `${shortAgo(now - health.lastFrameAt)} ago` : "—", "text-text-primary"],
    ["Server → browser", health.latencyMs === null ? "—" : `${health.latencyMs}ms`, "text-status-upcoming"],
    ["Reconnects", formatCount(health.reconnects), "text-text-primary"],
    ["Feed mismatches (>3× floor)", formatCount(feedMismatches), feedMismatches ? "text-tertiary" : "text-text-primary"],
  ];

  return (
    <section className="rounded-xl border border-white/8 bg-surface-card p-space-md">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">Market Stream</h2>
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
          ? "Test mode: Steam and secondary quotes drift every 2s (SIM). Relicto's floors, bids and alerts are real."
          : "Every figure is recorded market data; frames arrive when listings, bids or prices change."}
      </div>
    </section>
  );
}
