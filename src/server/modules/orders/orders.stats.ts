import type { LedgerStat } from "@/modules/orders/types";
import { money } from "./orders.presenter";

export type LedgerTotals = {
  volumeCents: number;
  purchases: number;
  liquidated: number;
  settled: number;
  disputed: number;
  spentCents: number;
  earnedCents: number;
  games: string[];
};

/** Sparkline geometry is art direction — the numbers beside it are not. */
const VOLUME_SPARK = { path: "M0 20 Q 20 18, 35 12 T 60 14 T 80 6 T 100 4", tone: "primary" } as const;
const PL_SPARK = { path: "M0 22 L 20 18 L 40 19 L 60 11 L 80 12 L 100 2", tone: "amber" } as const;

const GAME_LABEL: Record<string, string> = { cs2: "CS2", dota2: "Dota 2" };

const pct = (part: number, whole: number) => (whole === 0 ? 100 : Math.round((part / whole) * 1000) / 10);

const signed = (cents: number) => `${cents >= 0 ? "+" : "-"}${money(Math.abs(cents))}`;

/** The three headline tiles above the trade ledger, all derived from the ledger itself. */
export function toLedgerStats(totals: LedgerTotals): LedgerStat[] {
  const handoffs = totals.settled + totals.disputed;
  const netCents = totals.earnedCents - totals.spentCents;
  const yieldPct = totals.spentCents === 0 ? 0 : pct(netCents, totals.spentCents);
  const successRate = pct(totals.settled, handoffs);
  const scope = totals.games.map((id) => GAME_LABEL[id] ?? id).join(" & ");

  return [
    {
      id: "volume",
      label: "Total Traded Volume",
      icon: "currency_exchange",
      iconTone: "muted",
      value: money(totals.volumeCents),
      unit: "USD",
      notes: [`${totals.purchases} Purchases`, `${totals.liquidated} Liquidated`],
      spark: VOLUME_SPARK,
    },
    {
      id: "escrow-rate",
      label: "Escrow Success Rate",
      icon: "gavel",
      iconTone: "cyan",
      value: `${successRate}%`,
      ...(totals.disputed === 0 ? { badge: "ZERO FAULT" } : {}),
      notes: [`${totals.settled}/${handoffs} Bot Handoffs`, `${totals.disputed} Disputes`],
      bar: true,
    },
    {
      id: "net-pl",
      label: "Net Realized P/L",
      icon: "trending_up",
      iconTone: "amber",
      value: signed(netCents),
      unit: "USD",
      noteStrong: `${netCents >= 0 ? "+" : ""}${yieldPct}% Net Yield`,
      notes: scope ? [`across ${scope}`] : [],
      spark: PL_SPARK,
    },
  ];
}
