/** Shared number formatting for prices, counts and deltas. */

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const moneyWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const count = new Intl.NumberFormat("en-US");

/** 118.5 → "$118.50"; `{ whole: true }` → "$119". */
export function formatMoney(amount: number, { whole = false } = {}) {
  return (whole ? moneyWhole : money).format(amount);
}

/** 1248 → "1,248" */
export function formatCount(value: number) {
  return count.format(value);
}

/** 8.6 → "+8.6%", -2.1 → "-2.1%" */
export function formatDelta(percent: number, digits = 1) {
  const sign = percent > 0 ? "+" : percent < 0 ? "-" : "";
  return `${sign}${Math.abs(percent).toFixed(digits)}%`;
}

export type Trend = "up" | "down" | "flat";

/** Direction of a delta; |Δ| under `flatBelow` counts as flat. */
export function trendOf(percent: number, flatBelow = 0): Trend {
  if (Math.abs(percent) < flatBelow || percent === 0) return "flat";
  return percent > 0 ? "up" : "down";
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

/** 522 → "08:42"; hours are only shown when present. */
export function formatTimer(totalSeconds: number) {
  const { h, m, s } = splitSeconds(totalSeconds);
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
