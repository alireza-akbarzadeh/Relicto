import { z } from "zod";

/** The ledger's tab strip — mirrors the `counts` keys the UI renders. */
export const ledgerFilter = z.enum(["all", "purchases", "sales", "escrow", "disputed"]);
export type LedgerFilter = z.infer<typeof ledgerFilter>;

export const ledgerInput = z.object({
  filter: ledgerFilter.default("all"),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(6),
});
export type LedgerInput = z.infer<typeof ledgerInput>;
