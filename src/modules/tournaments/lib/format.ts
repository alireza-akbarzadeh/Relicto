import type { Capacity } from "../types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** 1500000 → "$1,500,000" */
export function formatUsd(amount: number) {
  return usd.format(amount);
}

/** 48200 → "48.2K" */
export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
    .format(value)
    .toUpperCase();
}

const pad = (n: number) => String(n).padStart(2, "0");

function splitSeconds(total: number) {
  const safe = Math.max(0, Math.floor(total));
  return { h: Math.floor(safe / 3600), m: Math.floor((safe % 3600) / 60), s: safe % 60 };
}

/** 15155 → "04:12:35" */
export function formatClock(totalSeconds: number) {
  const { h, m, s } = splitSeconds(totalSeconds);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** 15150 → "04h 12m 30s" */
export function formatCountdown(totalSeconds: number) {
  const { h, m, s } = splitSeconds(totalSeconds);
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

/** { filled: 58, total: 64, unit: "SQUADS" } → "58 / 64 SQUADS" */
export function formatCapacity({ filled, total, unit }: Capacity, separator = " / ") {
  return `${filled}${separator}${total} ${unit}`;
}

/** Share of the capacity that is filled, as a CSS width. */
export function capacityWidth({ filled, total }: Capacity) {
  if (total <= 0) return "0%";
  return `${Math.min(100, (filled / total) * 100)}%`;
}
