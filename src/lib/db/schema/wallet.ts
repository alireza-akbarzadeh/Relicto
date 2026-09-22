import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { orders } from "./orders";

export const ledgerDirection = pgEnum("ledger_direction", ["credit", "debit"]);
export const ledgerKind = pgEnum("ledger_kind", [
  "deposit",
  "withdrawal",
  "purchase",
  "sale",
  "fee",
  "refund",
  "promo",
]);
export const ledgerStatus = pgEnum("ledger_status", ["pending", "settled", "failed"]);
export const paymentRail = pgEnum("payment_rail", ["card", "crypto", "steam", "paypal", "bank"]);
export const payoutStatus = pgEnum("payout_status", ["requested", "processing", "paid", "failed"]);

export const walletAccounts = pgTable(
  "wallet_accounts",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    balanceCents: integer("balance_cents").notNull().default(0),
    currency: text("currency").notNull().default("USD"),
    ...timestamps,
  },
  (t) => [uniqueIndex("wallet_accounts_user_idx").on(t.userId)],
);

/** Append-only money movement. `balanceAfterCents` makes statements replayable. */
export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    id: primaryId(),
    walletId: text("wallet_id")
      .notNull()
      .references(() => walletAccounts.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
    direction: ledgerDirection("direction").notNull(),
    kind: ledgerKind("kind").notNull(),
    amountCents: integer("amount_cents").notNull(),
    balanceAfterCents: integer("balance_after_cents").notNull(),
    status: ledgerStatus("status").notNull().default("settled"),
    /** Settlement hash shown in the audit ledger. */
    hash: text("hash"),
    description: text("description"),
    occurredAt: timestamp("occurred_at").notNull().defaultNow(),
    ...createdAt,
  },
  (t) => [
    index("ledger_entries_wallet_idx").on(t.walletId),
    index("ledger_entries_occurred_at_idx").on(t.occurredAt),
    index("ledger_entries_kind_idx").on(t.kind),
  ],
);

export const paymentMethods = pgTable(
  "payment_methods",
  {
    id: primaryId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rail: paymentRail("rail").notNull(),
    label: text("label").notNull(),
    last4: text("last4"),
    isDefault: boolean("is_default").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("payment_methods_user_idx").on(t.userId)],
);

export const payouts = pgTable(
  "payouts",
  {
    id: primaryId(),
    walletId: text("wallet_id")
      .notNull()
      .references(() => walletAccounts.id, { onDelete: "cascade" }),
    paymentMethodId: text("payment_method_id").references(() => paymentMethods.id, { onDelete: "set null" }),
    amountCents: integer("amount_cents").notNull(),
    feeCents: integer("fee_cents").notNull().default(0),
    status: payoutStatus("status").notNull().default("requested"),
    requestedAt: timestamp("requested_at").notNull().defaultNow(),
    paidAt: timestamp("paid_at"),
    ...timestamps,
  },
  (t) => [index("payouts_wallet_idx").on(t.walletId), index("payouts_status_idx").on(t.status)],
);
