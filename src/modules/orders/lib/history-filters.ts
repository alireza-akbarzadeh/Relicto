import type { LedgerRow, OrderGame } from "../types";

export type LedgerTab = "all" | "purchases" | "sales" | "escrow" | "disputed";
export type GameFilter = "ALL" | OrderGame;

export const GAME_OPTIONS = [
  { value: "ALL" as const, label: "All Games (23)" },
  { value: "CS2" as const, label: "Counter-Strike 2" },
  { value: "DOTA 2" as const, label: "Dota 2" },
];

export const RANGE_OPTIONS = [
  { value: "30d" as const, label: "Last 30 Days" },
  { value: "90d" as const, label: "Past 90 Days" },
  { value: "2025" as const, label: "Year 2025" },
  { value: "all" as const, label: "All Time History" },
];

export type RangeFilter = (typeof RANGE_OPTIONS)[number]["value"];

const IN_TAB: Record<LedgerTab, (row: LedgerRow) => boolean> = {
  all: () => true,
  purchases: (row) => row.flow === "buy",
  sales: (row) => row.flow === "sell" || row.flow === "liquidate",
  escrow: (row) => row.state === "escrow",
  disputed: (row) => row.state === "disputed",
};

/** Rows left after the tab, game and free-text filters. */
export function selectRows(rows: LedgerRow[], tab: LedgerTab, game: GameFilter, query: string) {
  const needle = query.trim().toLowerCase();
  return rows.filter((row) => {
    if (!IN_TAB[tab](row)) return false;
    if (game !== "ALL" && row.game !== game) return false;
    if (!needle) return true;
    return [row.code, row.itemName, row.itemDetail, row.party.name, row.flowNote].join(" ").toLowerCase().includes(needle);
  });
}
