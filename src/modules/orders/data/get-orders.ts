import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { orderService } from "@/server/modules/orders/orders.service";
import type { LedgerData } from "../types";
import { active, rows, stats } from "./history.mock";

const tally = (match: (row: (typeof rows)[number]) => boolean) => rows.filter(match).length;

/** Shown until the signed-in trader has a ledger of their own to render. */
const SAMPLE: LedgerData = {
  poll: "POLL RATE 1.2s",
  vault: { label: "Cold Escrow Vault", value: "256-BIT INSURED", tier: "TIER 1" },
  stats,
  active,
  rows,
  total: rows.length,
  pages: 1,
  counts: {
    all: rows.length,
    purchases: tally((r) => r.flow === "buy"),
    sales: tally((r) => r.flow !== "buy"),
    escrow: tally((r) => r.state === "escrow"),
    disputed: tally((r) => r.state === "disputed"),
  },
};

/**
 * Trade ledger for the signed-in trader, from Postgres. Falls back to the
 * sample ledger while the account has no orders, so the screen is never blank.
 */
export async function getOrderLedger(): Promise<LedgerData> {
  const ledger = await orderService.ledger(await requireUserId());
  return ledger.counts.all > 0 ? ledger : SAMPLE;
}
