import type { StreamState } from "../hooks/use-live-book";
import type { TrackerTone } from "../types";

export const TRACKER_TONE: Record<TrackerTone, string> = {
  primary: "text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  muted: "text-text-muted",
};

/** Badge for a stream's connection state, shared by every live panel. */
export const STREAM_STATE: Record<StreamState, { label: string; tone: string; dot: string }> = {
  live: { label: "Live", tone: "text-status-upcoming", dot: "bg-status-upcoming animate-pulse" },
  polling: { label: "Polling", tone: "text-tertiary", dot: "bg-tertiary" },
  connecting: { label: "Connecting", tone: "text-text-muted", dot: "bg-text-muted animate-pulse" },
  offline: { label: "Offline", tone: "text-status-live", dot: "bg-status-live" },
};

/** 4_200 → "4s", 185_000 → "3m", 90_000_000 → "1d". */
export function shortAgo(ms: number) {
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86_400)}d`;
}

/** 12.5 → "+$12.50", -3 → "-$3.00". */
export function signedMoney(usd: number) {
  return `${usd >= 0 ? "+" : "-"}$${Math.abs(usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function signedPct(pct: number) {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}
