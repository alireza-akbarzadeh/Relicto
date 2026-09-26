"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { canConfirm, markDispatched, parseOfferRef, simulateDispatch, type P2PResult } from "@/server/modules/escrow/escrow.p2p";
import { dispatchInput, orderCodeInput } from "@/server/modules/escrow/escrow.schema";
import { escrowService, type EscrowResult } from "@/server/modules/escrow/escrow.service";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/** Applies the result of a trader's escrow action: push the notices, refresh every page that shows the order. */
function settle(result: EscrowResult | P2PResult) {
  if (result.status !== "applied") return { status: result.status };
  after(() => notificationService.deliver(result.notices));
  revalidatePath("/", "layout");
  return { status: result.status };
}

/** The buyer cancels before a trade offer is out; the vault is refunded and the listing relisted. */
export async function cancelOrder(input: z.input<typeof orderCodeInput>) {
  const { code } = orderCodeInput.parse(input);
  return settle(await escrowService.cancelByBuyer(code, await requireUserId()));
}

/** Either side freezes the escrow for review; funds stay locked. */
export async function disputeOrder(input: z.input<typeof orderCodeInput>) {
  const { code } = orderCodeInput.parse(input);
  return settle(await escrowService.disputed(code, await requireUserId()));
}

/** Seller: "I've sent the Steam trade offer" — with its link or id, so the buyer can open it. */
export async function markTradeSent(input: z.input<typeof dispatchInput>) {
  const { code, offer } = dispatchInput.parse(input);
  const ref = parseOfferRef(offer);
  if (!ref) return { status: "invalid-offer" as const };
  return settle(await markDispatched(code, await requireUserId(), ref.id));
}

/** Buyer: the item arrived in Steam. Completes the order and releases the seller's payout. */
export async function confirmReceived(input: z.input<typeof orderCodeInput>) {
  const { code } = orderCodeInput.parse(input);
  const check = await canConfirm(code, await requireUserId());
  if (check !== "ok") return { status: check };
  return settle(await escrowService.delivered(code));
}

/** Test mode only: play the seller's part on your own purchase. */
export async function simulateSellerDispatch(input: z.input<typeof orderCodeInput>) {
  const { code } = orderCodeInput.parse(input);
  return settle(await simulateDispatch(code, await requireUserId()));
}
