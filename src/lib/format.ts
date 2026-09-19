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
