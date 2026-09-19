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

/** { filled: 58, total: 64, unit: "SQUADS" } → "58 / 64 SQUADS" */
export function formatCapacity({ filled, total, unit }: Capacity, separator = " / ") {
  return `${filled}${separator}${total} ${unit}`;
}

/** Share of the capacity that is filled, as a CSS width. */
export function capacityWidth({ filled, total }: Capacity) {
  if (total <= 0) return "0%";
  return `${Math.min(100, (filled / total) * 100)}%`;
}
