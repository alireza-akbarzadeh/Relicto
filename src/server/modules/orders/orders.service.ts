import "server-only";

import type { ActiveEscrow, LedgerData, OrderTracking } from "@/modules/orders/types";
import { toLedgerRow } from "./orders.presenter";
import * as repository from "./orders.repository";
import { ledgerInput, type LedgerInput } from "./orders.schema";
import { toLedgerStats } from "./orders.stats";
import type { LedgerOrderRow } from "./orders.types";
import { toOrderTracking } from "./tracking.presenter";
import * as tracking from "./tracking.repository";

/** Vault chrome above the table — a product claim, not a per-trader figure. */
const VAULT = { label: "Cold Escrow Vault", value: "256-BIT INSURED", tier: "TIER 1" } as const;

/** Drops the parenthetical so the banner reads "Hero — Item". */
const headline = (row: LedgerOrderRow) =>
  [row.nameSnapshot, row.detailSnapshot?.split(" (")[0]].filter(Boolean).join(" — ");

function toActiveEscrow(row: LedgerOrderRow, escrowCount: number): ActiveEscrow {
  const code = row.code.replace(/^#/, "");

  return {
    count: `${escrowCount} Active Escrow${escrowCount === 1 ? "" : "s"}`,
    step: `STEP ${row.escrowStep ?? 1}/4`,
    code: `#${code}`,
    item: headline(row),
    href: `/orders/${code}`,
  };
}

export const orderService = {
  /** The trade ledger for one trader, shaped as the page's `LedgerData`. */
  async ledger(userId: string, rawInput: Partial<LedgerInput> = {}): Promise<LedgerData> {
    const input = ledgerInput.parse(rawInput);
    const now = new Date();

    const [{ rows, total }, counts, totals, escrow] = await Promise.all([
      repository.findLedgerRows(userId, input.filter, input.page, input.perPage),
      repository.countLedger(userId),
      repository.aggregateLedger(userId),
      repository.findActiveEscrow(userId),
    ]);

    return {
      poll: "POLL RATE 1.2s",
      vault: VAULT,
      stats: toLedgerStats(totals),
      active: escrow
        ? toActiveEscrow(escrow, counts.escrow)
        : { count: "0 Active Escrows", step: "IDLE", code: "—", item: "No open escrow", href: "/orders" },
      rows: rows.map((row) => toLedgerRow(row, now)),
      total,
      pages: Math.max(1, Math.ceil(total / input.perPage)),
      counts,
    };
  },

  /** Live escrow state for one order code, or null when it isn't ours. */
  async tracking(code: string): Promise<OrderTracking | null> {
    const row = await tracking.findOrderByCode(code);
    if (!row) return null;

    const [events, offer, vendor] = await Promise.all([
      tracking.findEscrowEvents(row.order.id),
      tracking.findTradeOffer(row.order.id),
      tracking.findVendorProfile(row.order.sellerId),
    ]);

    return toOrderTracking({ ...row, events, offer, vendor });
  },
};
