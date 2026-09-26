import { randomInt } from "node:crypto";
import type { escrowEvents, ledgerEntries, orderItems, orders } from "@/lib/db/schema";
import { usd } from "../wallet/wallet.presenter";
import type { CartLine } from "./checkout.repository";

/**
 * Trades run peer to peer until Relicto's escrow bots exist: the seller sends
 * the Steam trade offer themselves, the buyer accepts it in Steam and confirms
 * here, and only then is the seller paid. A fresh escrow waits on the seller.
 */
const ESCROW_STEPS = [
  { step: 1, state: "done", title: "Escrow Vault Funded" },
  {
    step: 2, state: "active", title: "Seller Dispatch",
    body: "Waiting for the seller to send the Steam trade offer. They have 12 hours, or escrow refunds automatically.",
  },
  {
    step: 3, state: "queued", title: "Trade Offer Sent",
    body: "The seller's Steam trade offer arrives at your Trade URL. Accept it in Steam, then confirm receipt here.",
  },
  {
    step: 4, state: "queued", title: "Settlement & Inventory Vault",
    body: "Once you confirm receipt, the item is yours and escrow releases the payout to the seller.",
  },
] as const;

/** The seller's window to send the trade offer before escrow refunds the buyer. */
export const DISPATCH_WINDOW_SECONDS = 12 * 60 * 60;
const AUTO_CANCEL_SECONDS = DISPATCH_WINDOW_SECONDS;

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
  /** The rail the buyer paid on, as the tracker and ledger name it. */
  fundingLabel: string;
  /**
   * The price the two sides agreed, when it isn't the ask — an accepted offer.
   * It becomes the subtotal, which is what the seller is paid on delivery.
   */
  agreedCents?: number;
};

/**
 * Everything one basket line becomes: an escrow order, its snapshot line, the
 * tracker timeline and the vault debit. Checkout-made rows carry a `chk` prefix
 * so the seed can clear test purchases on re-run.
 */
export function buildOrderRows(line: CartLine, at: Placement) {
  const { listing } = line;
  const priceCents = at.agreedCents ?? listing.priceCents;
  const p = listing.checkout;
  const orderId = `order-chk-${at.code.toLowerCase()}`;

  const order = {
    id: orderId,
    code: at.code,
    buyerId: at.buyerId,
    sellerId: listing.sellerId,
    flow: "buy",
    state: "escrow",
    subtotalCents: priceCents,
    feeCents: 0,
    totalCents: at.totalCents,
    placedAt: at.now,
    autoCancelSeconds: AUTO_CANCEL_SECONDS,
    fundingLabel: at.fundingLabel,
    settlementNote: "Fee $0.00 (Escrow)",
    // Peer to peer: the other side is the seller, named from their profile wherever it's shown.
    counterpartyKind: "user",
    counterpartyName: null,
    counterpartyNote: "Seller · P2P Steam trade",
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
    priceCents,
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
    body: "body" in step ? step.body : `${usd(at.totalCents)} locked via ${at.fundingLabel}.`,
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
    // Pending until the buyer confirms receipt; the escrow card counts the hold.
    status: "pending",
    hash: `#TX-${randomInt(1_000_000, 10_000_000)}`,
    venue: "steam-escrow",
    title: "Marketplace Item Acquire",
    assetLabel: p?.subname ? `${line.name} (${p.subname})` : line.name,
    detailLabel: p?.detail ?? null,
    nodeLabel: "P2P Steam Escrow",
    occurredAt: at.now,
  } satisfies typeof ledgerEntries.$inferInsert;

  return { order, item, events, debit };
}
