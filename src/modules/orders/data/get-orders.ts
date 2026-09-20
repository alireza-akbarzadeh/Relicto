import "server-only";
import type { LedgerData } from "../types";
import { active, rows, stats } from "./history.mock";

/** Trade ledger snapshot. Mock today; swap for the orders API without touching the UI. */
export async function getOrderLedger(): Promise<LedgerData> {
  return {
    poll: "POLL RATE 1.2s",
    vault: { label: "Cold Escrow Vault", value: "256-BIT INSURED", tier: "TIER 1" },
    stats,
    active,
    rows,
    total: 23,
    pages: 4,
    counts: { all: 23, purchases: 14, sales: 8, escrow: 1, disputed: 0 },
  };
}
