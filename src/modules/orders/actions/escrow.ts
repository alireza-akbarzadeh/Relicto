"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { orderCodeInput } from "@/server/modules/escrow/escrow.schema";
import { escrowService, type EscrowResult } from "@/server/modules/escrow/escrow.service";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/** Applies the result of a trader's escrow action: push the notices, refresh every page that shows the order. */
function settle(result: EscrowResult) {
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
