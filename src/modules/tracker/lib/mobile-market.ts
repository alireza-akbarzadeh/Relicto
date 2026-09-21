import { parseAsString } from "nuqs/server";
import { formatMoney } from "@/lib/format";
import type { ArbQuote, DepthLevel } from "../mobile.types";

/** Selected Doppler phase (mobile-only key); empty means the data's default. */
export const phaseSearchParam = parseAsString.withDefault("");

/** Best bid vs lowest ask: "$10.00 (0.32%)". */
export function formatSpread(bids: DepthLevel[], asks: DepthLevel[]) {
  const bestBid = Math.max(...bids.map((level) => level.priceUsd));
  const bestAsk = Math.min(...asks.map((level) => level.priceUsd));
  const gap = bestAsk - bestBid;
  return `${formatMoney(gap)} (${((gap / bestAsk) * 100).toFixed(2)}%)`;
}

/** Cross-market spread of an arbitrage leg, e.g. "+11.4%". */
export function legSpread(buy: ArbQuote, sell: ArbQuote) {
  return `+${(((sell.priceUsd - buy.priceUsd) / buy.priceUsd) * 100).toFixed(1)}%`;
}

/** Ticker change chip: amber for gains, red for losses. */
export function tickTone(changePct: number) {
  return changePct < 0 ? "bg-error-container/40 text-status-live" : "bg-tertiary-container/30 text-tertiary";
}
