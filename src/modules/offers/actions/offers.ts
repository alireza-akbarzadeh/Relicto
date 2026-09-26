"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { notificationService } from "@/server/modules/notifications/notifications.service";
import { makeOfferInput, offerIdInput } from "@/server/modules/offers/offers.schema";
import { offerService } from "@/server/modules/offers/offers.service";

/**
 * Bid writes. Each checks the session itself (actions are plain POST
 * endpoints); the other side's notifications are recorded with the change and
 * pushed to their devices after the response.
 */

/** Buyer: bid on one copy, or revise the open bid on it. */
export async function makeOffer(input: z.input<typeof makeOfferInput>) {
  const result = await offerService.make(await requireUserId(), makeOfferInput.parse(input));
  if (result.status !== "placed" && result.status !== "revised") return { status: result.status };

  revalidatePath("/", "layout");
  after(() => notificationService.deliver(result.notices));
  return { status: result.status };
}

/** Buyer: pull an open bid. */
export async function withdrawOffer(input: z.input<typeof offerIdInput>) {
  const ok = await offerService.withdraw(await requireUserId(), offerIdInput.parse(input).offerId);
  if (ok) revalidatePath("/", "layout");
  return { ok };
}

/** Seller: take a bid — escrow opens at the bid price, funded from the buyer's vault. */
export async function acceptOffer(input: z.input<typeof offerIdInput>) {
  const result = await offerService.accept(await requireUserId(), offerIdInput.parse(input).offerId);
  if ("notices" in result) {
    revalidatePath("/", "layout");
    after(() => notificationService.deliver(result.notices));
  }
  return result.status === "accepted" ? { status: result.status, code: result.code } : { status: result.status };
}

/** Seller: turn a bid down. */
export async function declineOffer(input: z.input<typeof offerIdInput>) {
  const result = await offerService.decline(await requireUserId(), offerIdInput.parse(input).offerId);
  if (result.status === "declined") {
    revalidatePath("/", "layout");
    after(() => notificationService.deliver(result.notices));
  }
  return { status: result.status };
}
