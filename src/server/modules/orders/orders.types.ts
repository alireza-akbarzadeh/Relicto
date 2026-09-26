import type { orders } from "@/lib/db/schema";

type OrderRow = typeof orders.$inferSelect;

/** One ledger line: the order plus the single item it settled. */
export type LedgerOrderRow = Pick<
  OrderRow,
  | "id"
  | "code"
  | "flow"
  | "state"
  | "totalCents"
  | "placedAt"
  | "fundingLabel"
  | "settlementNote"
  | "counterpartyKind"
  | "counterpartyName"
  | "counterpartyNote"
  | "thumbnailUrl"
  | "thumbnailAlt"
  | "buyerId"
  | "sellerId"
  | "subtotalCents"
> & {
  nameSnapshot: string | null;
  detailSnapshot: string | null;
  gameId: string | null;
  rarity: string | null;
  /** Highest escrow step reached, for the "Step 3/4" label. */
  escrowStep: number | null;
  buyerName: string | null;
  sellerName: string | null;
};

export type LedgerCounts = {
  all: number;
  purchases: number;
  sales: number;
  escrow: number;
  disputed: number;
};
