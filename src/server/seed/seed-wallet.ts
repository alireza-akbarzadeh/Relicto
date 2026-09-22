/**
 * Treasury + audit ledger, seeded to mirror `wallet.mock` so `/wallet` renders
 * the same screen against Postgres.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";

type Db = NodePgDatabase<typeof schema>;

const HOUR = 60 * 60 * 1000;

const LIQUID_CENTS = 314000;

const ENTRIES = (now: number) => [
  {
    hash: "#TX-9841209", direction: "debit", kind: "withdrawal", venue: "tron", status: "settled",
    amountCents: 85000, balanceAfterCents: LIQUID_CENTS, occurredAt: new Date(now - 3 * HOUR),
    title: "Instant Cashout (USDT TRC20)", assetLabel: "0x71C92a46B9f76D...91823B492",
    detailLabel: "Tron Protocol Network", nodeLabel: "Dispatched in 42s",
  },
  {
    hash: "#TX-9840884", direction: "credit", kind: "sale", venue: "steam-escrow", status: "settled",
    amountCents: 315000, balanceAfterCents: LIQUID_CENTS + 85000, occurredAt: new Date(now - 9 * HOUR),
    title: "P2P Skin Sale Credit", assetLabel: "★ Butterfly Knife | Doppler (Phase 4)",
    detailLabel: "Buyer: @Kuro_Vault (Verified)", nodeLabel: "Steam Escrow Bot #14",
  },
  {
    hash: "#TX-9839912", direction: "credit", kind: "deposit", venue: "stripe", status: "settled",
    amountCents: 50000, balanceAfterCents: LIQUID_CENTS - 230000, occurredAt: new Date(now - 20 * HOUR),
    title: "Instant Card Ingress", assetLabel: "Visa ending in 4092",
    detailLabel: "Stripe 3DS Escrow Engine", nodeLabel: "Direct Settlement Gateway",
  },
  {
    hash: "#TX-9837102", direction: "debit", kind: "purchase", venue: "marketplace", status: "settled",
    amountCents: 11850, balanceAfterCents: LIQUID_CENTS - 280000, occurredAt: new Date(now - 30 * HOUR),
    title: "Marketplace Item Acquire", assetLabel: "Manifold Paradox (Phantom Assassin Arcana)",
    detailLabel: "Exalted Level 3 Unlocked", nodeLabel: "Steam Escrow Bot #03",
  },
  {
    hash: "#TX-9835210", direction: "credit", kind: "sale", venue: "market-maker", status: "pending",
    amountCents: 61280, balanceAfterCents: LIQUID_CENTS - 268150, occurredAt: new Date(now - 44 * HOUR),
    title: "Trade-Up Surplus Liquidation", assetLabel: "14 Mil-Spec Trade-Up Remains",
    detailLabel: "Instant Platform Liquidation Option", nodeLabel: "Internal Market Maker",
  },
  {
    hash: "#TX-9831004", direction: "debit", kind: "withdrawal", venue: "sepa", status: "pending",
    amountCents: 120000, balanceAfterCents: LIQUID_CENTS - 329430, occurredAt: new Date(now - 60 * HOUR),
    title: "SEPA Instant Clearing", assetLabel: "IBAN ending in DE89",
    detailLabel: "Revolut Banking AG", nodeLabel: "Escrow Bot Multi-Sig",
  },
  {
    hash: "#TX-9829800", direction: "credit", kind: "promo", venue: "internal", status: "settled",
    amountCents: 4220, balanceAfterCents: LIQUID_CENTS - 333650, occurredAt: new Date(now - 72 * HOUR),
    title: "Gold Tier Fee Rebate", assetLabel: "0.5% maker discount",
    detailLabel: "Applied automatically", nodeLabel: "Relicto Rewards Engine",
  },
] as const;

export async function seedWallet(db: Db, traderId: string) {
  const walletId = `wallet-${traderId}`;

  const account = {
    id: walletId,
    userId: traderId,
    balanceCents: LIQUID_CENTS,
    currency: "USD",
  } satisfies typeof schema.walletAccounts.$inferInsert;

  await db
    .insert(schema.walletAccounts)
    .values(account)
    .onConflictDoUpdate({ target: schema.walletAccounts.userId, set: { balanceCents: LIQUID_CENTS } });

  for (const entry of ENTRIES(Date.now())) {
    const row = {
      ...entry,
      id: `ledger-${entry.hash.replace(/[^A-Za-z0-9]/g, "").toLowerCase()}`,
      walletId,
    } satisfies typeof schema.ledgerEntries.$inferInsert;

    await db.insert(schema.ledgerEntries).values(row).onConflictDoUpdate({ target: schema.ledgerEntries.id, set: row });
  }

  return ENTRIES(0).length;
}
