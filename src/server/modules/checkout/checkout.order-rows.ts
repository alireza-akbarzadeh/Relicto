import { randomInt } from "node:crypto";
import type { escrowEvents, ledgerEntries, orderItems, orders } from "@/lib/db/schema";
import { usd } from "../wallet/wallet.presenter";
import type { CartLine } from "./checkout.repository";

/**
 * Escrow bots and Steam trade offers are out of scope until trading is
 * validated (backend-plan, Phase 4), so a fresh escrow stops at the audit and
 * no trade offer row exists yet.
 */
const ESCROW_STEPS = [
  { step: 1, state: "done", title: "Escrow Vault Funded" },
  {
    step: 2, state: "active", title: "Bot Security Audit",
    body: "Queued for a Sentinel bot. Steam Guard API and anti-phishing checks pending.",
  },
  {
    step: 3, state: "queued", title: "Trade Offer Dispatched",
    body: "A Steam trade offer goes to your verified Trade URL once the audit clears.",
  },
  {
    step: 4, state: "queued", title: "Settlement & Inventory Vault",
    body: "Asset permanently bound to your linked Steam profile and escrow payout released to vendor.",
  },
] as const;

/** Mirrors the escrow window the checkout promises (180 seconds). */
const AUTO_CANCEL_SECONDS = 180;

const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

/** A tracking code in the ledger's shape ("LT-89410-ES"). */
export function orderCode() {
  return `LT-${randomInt(10000, 100000)}-${LETTERS[randomInt(LETTERS.length)]}${LETTERS[randomInt(LETTERS.length)]}`;
}

type Placement = {
  buyerId: string;
  code: string;
  totalCents: number;
  walletId: string;
  balanceAfterCents: number;
  now: Date;
};

/**
 * Everything one basket line becomes: an escrow order, its snapshot line, the
 * tracker timeline and the vault debit. Checkout-made rows carry a `chk` prefix
 * so the seed can clear test purchases on re-run.
 */
export function buildOrderRows(line: CartLine, at: Placement) {
  const { listing } = line;
  const p = listing.checkout;
  const orderId = `order-chk-${at.code.toLowerCase()}`;
  const bot = listing.botName ?? "Relicto Sentinel";

  const order = {
    id: orderId,
    code: at.code,
    buyerId: at.buyerId,
    sellerId: listing.sellerId,
    flow: "buy",
    state: "escrow",
    subtotalCents: listing.priceCents,
    feeCents: 0,
    totalCents: at.totalCents,
    placedAt: at.now,
    autoCancelSeconds: AUTO_CANCEL_SECONDS,
    fundingLabel: "Relicto Vault Balance",
    settlementNote: "Fee $0.00 (Escrow)",
    counterpartyKind: "bot",
    counterpartyName: bot,
    counterpartyNote: "Auto Handoff",
    thumbnailUrl: listing.imageUrl ?? line.imageUrl,
    thumbnailAlt: listing.imageAlt ?? line.imageAlt ?? line.name,
  } satisfies typeof orders.$inferInsert;

  const item = {
    id: `${orderId}-line`,
    orderId,
    listingId: listing.id,
    itemId: listing.itemId,
    nameSnapshot: line.name,
    detailSnapshot: p?.detail ?? null,
    priceCents: listing.priceCents,
    wear: listing.wear,
    float: listing.float,
    paintSeed: listing.paintSeed,
    stattrak: listing.stattrak,
    attributes: p?.subname ? { styleNote: p.subname } : {},
  } satisfies typeof orderItems.$inferInsert;

  const events = ESCROW_STEPS.map((step) => ({
    id: `${orderId}-step-${step.step}`,
    orderId,
    step: step.step,
    state: step.state,
    title: step.title,
    body: "body" in step ? step.body : `${usd(at.totalCents)} locked from your Relicto vault balance.`,
    occurredAt: at.now,
  })) satisfies (typeof escrowEvents.$inferInsert)[];

  const debit = {
    id: `ledger-chk-${at.code.toLowerCase()}`,
    walletId: at.walletId,
    orderId,
    direction: "debit",
    kind: "purchase",
    amountCents: at.totalCents,
    balanceAfterCents: at.balanceAfterCents,
    // Pending until the bot hands the item over; the escrow card counts the hold.
    status: "pending",
    hash: `#TX-${randomInt(1_000_000, 10_000_000)}`,
    venue: "steam-escrow",
    title: "Marketplace Item Acquire",
    assetLabel: p?.subname ? `${line.name} (${p.subname})` : line.name,
    detailLabel: p?.detail ?? null,
    nodeLabel: bot,
    occurredAt: at.now,
  } satisfies typeof ledgerEntries.$inferInsert;

  return { order, item, events, debit };
}
