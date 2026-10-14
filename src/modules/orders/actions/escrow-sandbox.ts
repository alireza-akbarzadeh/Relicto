"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { getSession } from "@/modules/relicto/data/get-session";
import { escrowService } from "@/server/modules/escrow/escrow.service";
import { notificationService } from "@/server/modules/notifications/notifications.service";

export async function simulateBotOfferSent(orderCode: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const token = `${Math.floor(100 + Math.random() * 900)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  const steamOfferId = String(Math.floor(100000 + Math.random() * 900000));
  const botName = "Relicto Sentinel Bot #42";

  const result = await escrowService.offerSent(orderCode, {
    steamOfferId,
    botName,
    token,
  });

  if (result.status === "applied") {
    after(() => notificationService.deliver(result.notices));
  }

  revalidatePath(`/orders/${orderCode}`);
  revalidatePath("/orders");
  return result;
}

export async function simulateBuyerAcceptance(orderCode: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const result = await escrowService.delivered(orderCode);
  if (result.status === "applied") {
    after(() => notificationService.deliver(result.notices));
  }

  revalidatePath(`/orders/${orderCode}`);
  revalidatePath("/orders");
  return result;
}

export async function simulateOrderCancellation(orderCode: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const result = await escrowService.cancelled(orderCode, "Simulation: Seller trade offer expired");
  if (result.status === "applied") {
    after(() => notificationService.deliver(result.notices));
  }

  revalidatePath(`/orders/${orderCode}`);
  revalidatePath("/orders");
  return result;
}
