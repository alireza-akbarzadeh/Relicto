import "server-only";

import { and, count, desc, eq, inArray, or, sql, sum, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { escrowEvents, items, orderItems, orders } from "@/lib/db/schema";
import type { LedgerFilter } from "./orders.schema";
import type { LedgerCounts, LedgerOrderRow } from "./orders.types";

/** Every order the trader is a party to, either side of the trade. */
const mine = (userId: string) => or(eq(orders.buyerId, userId), eq(orders.sellerId, userId)) as SQL;

function filterFor(filter: LedgerFilter): SQL | undefined {
  if (filter === "purchases") return eq(orders.flow, "buy");
  if (filter === "sales") return inArray(orders.flow, ["sell", "liquidate"]);
  if (filter === "escrow") return eq(orders.state, "escrow");
  if (filter === "disputed") return eq(orders.state, "disputed");
  return undefined;
}

/**
 * Which step the order is actually on, for the "Step 3/4" label. Queued steps
 * are excluded — they're the road ahead, not progress made.
 */
const escrowStep = db
  .select({
    orderId: escrowEvents.orderId,
    step: sql<number>`max(${escrowEvents.step}) filter (where ${escrowEvents.state} <> 'queued')`.as("step"),
  })
  .from(escrowEvents)
  .groupBy(escrowEvents.orderId)
  .as("escrow_step");

const LEDGER_COLUMNS = {
  id: orders.id,
  code: orders.code,
  flow: orders.flow,
  state: orders.state,
  totalCents: orders.totalCents,
  placedAt: orders.placedAt,
  fundingLabel: orders.fundingLabel,
  settlementNote: orders.settlementNote,
  counterpartyKind: orders.counterpartyKind,
  counterpartyName: orders.counterpartyName,
  counterpartyNote: orders.counterpartyNote,
  thumbnailUrl: orders.thumbnailUrl,
  thumbnailAlt: orders.thumbnailAlt,
  nameSnapshot: orderItems.nameSnapshot,
  detailSnapshot: orderItems.detailSnapshot,
  gameId: items.gameId,
  rarity: sql<string | null>`${items.rarity}`,
  escrowStep: escrowStep.step,
};

export async function findLedgerRows(userId: string, filter: LedgerFilter, page: number, perPage: number) {
  const where = and(mine(userId), filterFor(filter));

  const rows = (await db
    .select(LEDGER_COLUMNS)
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .leftJoin(escrowStep, eq(escrowStep.orderId, orders.id))
    .where(where)
    .orderBy(desc(orders.placedAt))
    .limit(perPage)
    .offset((page - 1) * perPage)) as LedgerOrderRow[];

  const [{ value: total }] = await db.select({ value: count() }).from(orders).where(where);

  return { rows, total };
}

/** The tab badges above the ledger, in one round trip. */
export async function countLedger(userId: string): Promise<LedgerCounts> {
  const [row] = await db
    .select({
      all: count(),
      purchases: sql<number>`count(*) filter (where ${orders.flow} = 'buy')::int`,
      sales: sql<number>`count(*) filter (where ${orders.flow} in ('sell', 'liquidate'))::int`,
      escrow: sql<number>`count(*) filter (where ${orders.state} = 'escrow')::int`,
      disputed: sql<number>`count(*) filter (where ${orders.state} = 'disputed')::int`,
    })
    .from(orders)
    .where(mine(userId));

  return row ?? { all: 0, purchases: 0, sales: 0, escrow: 0, disputed: 0 };
}

export async function aggregateLedger(userId: string) {
  const [row] = await db
    .select({
      volumeCents: sum(orders.totalCents),
      purchases: sql<number>`count(*) filter (where ${orders.flow} = 'buy')::int`,
      liquidated: sql<number>`count(*) filter (where ${orders.flow} in ('sell', 'liquidate'))::int`,
      settled: sql<number>`count(*) filter (where ${orders.state} = 'completed')::int`,
      disputed: sql<number>`count(*) filter (where ${orders.state} = 'disputed')::int`,
      spentCents: sql<number>`coalesce(sum(${orders.totalCents}) filter (where ${orders.flow} = 'buy'), 0)::int`,
      earnedCents: sql<number>`coalesce(sum(${orders.totalCents}) filter (where ${orders.flow} in ('sell', 'liquidate')), 0)::int`,
    })
    .from(orders)
    .where(mine(userId));

  const games = await db
    .selectDistinct({ gameId: items.gameId })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(items, eq(orderItems.itemId, items.id))
    .where(mine(userId));

  return {
    volumeCents: Number(row?.volumeCents ?? 0),
    purchases: row?.purchases ?? 0,
    liquidated: row?.liquidated ?? 0,
    settled: row?.settled ?? 0,
    disputed: row?.disputed ?? 0,
    spentCents: row?.spentCents ?? 0,
    earnedCents: row?.earnedCents ?? 0,
    games: games.map((g) => g.gameId),
  };
}

/** The one order still in escrow, surfaced as a banner above the ledger. */
export async function findActiveEscrow(userId: string) {
  const [row] = (await db
    .select(LEDGER_COLUMNS)
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .leftJoin(escrowStep, eq(escrowStep.orderId, orders.id))
    .where(and(mine(userId), eq(orders.state, "escrow")))
    .orderBy(desc(orders.placedAt))
    .limit(1)) as LedgerOrderRow[];

  return row ?? null;
}
