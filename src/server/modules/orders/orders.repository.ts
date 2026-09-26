import "server-only";

import { and, count, desc, eq, inArray, or, sql, sum, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { escrowEvents, items, orderItems, orders } from "@/lib/db/schema";
import type { LedgerFilter } from "./orders.schema";
import type { LedgerCounts, LedgerOrderRow } from "./orders.types";

/** Every order the trader is a party to, either side of the trade. */
const mine = (userId: string) => or(eq(orders.buyerId, userId), eq(orders.sellerId, userId)) as SQL;

/**
 * The viewer's side of an order. A marketplace order is a `buy` from its
 * buyer's side and a sale from its seller's; `sell` and `liquidate` orders are
 * the trader cashing out to Relicto, so always theirs to earn from.
 */
const boughtBy = (userId: string) => and(eq(orders.buyerId, userId), eq(orders.flow, "buy")) as SQL;
const soldBy = (userId: string) =>
  or(and(eq(orders.sellerId, userId), eq(orders.flow, "buy")), and(eq(orders.buyerId, userId), inArray(orders.flow, ["sell", "liquidate"]))) as SQL;

/** What the seller is paid on a marketplace order (the agreed price), or the cash-out total. */
const earned = sql`case when ${orders.flow} = 'buy' then ${orders.subtotalCents} else ${orders.totalCents} end`;

function filterFor(filter: LedgerFilter, userId: string): SQL | undefined {
  if (filter === "purchases") return boughtBy(userId);
  if (filter === "sales") return soldBy(userId);
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
  buyerId: orders.buyerId,
  sellerId: orders.sellerId,
  subtotalCents: orders.subtotalCents,
  // Both parties by name, so each side can see who they traded with.
  buyerName: sql<string | null>`(select coalesce(p.handle, u.name) from "user" u left join profiles p on p.user_id = u.id where u.id = ${orders.buyerId})`,
  sellerName: sql<string | null>`(select coalesce(p.handle, u.name) from "user" u left join profiles p on p.user_id = u.id where u.id = ${orders.sellerId})`,
};

export async function findLedgerRows(userId: string, filter: LedgerFilter, page: number, perPage: number) {
  const where = and(mine(userId), filterFor(filter, userId));

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
      purchases: sql<number>`count(*) filter (where ${boughtBy(userId)})::int`,
      sales: sql<number>`count(*) filter (where ${soldBy(userId)})::int`,
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
      purchases: sql<number>`count(*) filter (where ${boughtBy(userId)})::int`,
      liquidated: sql<number>`count(*) filter (where ${soldBy(userId)})::int`,
      settled: sql<number>`count(*) filter (where ${orders.state} = 'completed')::int`,
      disputed: sql<number>`count(*) filter (where ${orders.state} = 'disputed')::int`,
      // Refunded orders cost and earned nothing.
      spentCents: sql<number>`coalesce(sum(${orders.totalCents}) filter (where ${boughtBy(userId)} and ${orders.state} <> 'cancelled'), 0)::int`,
      earnedCents: sql<number>`coalesce(sum(${earned}) filter (where ${soldBy(userId)} and ${orders.state} <> 'cancelled'), 0)::int`,
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
