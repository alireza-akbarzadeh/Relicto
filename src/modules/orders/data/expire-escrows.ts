import "server-only";
import { after } from "next/server";
import { cache } from "react";
import { escrowService } from "@/server/modules/escrow/escrow.service";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/**
 * Refunds the viewer's escrows whose window lapsed with no trade offer, before
 * anything reads them — so no page shows a dead escrow as live, whatever the
 * cron schedule. Cached per request: every loader can call it, it runs once.
 */
export const expireViewerEscrows = cache(async (userId: string) => {
  const { notices } = await escrowService.expireOverdue(userId);
  if (notices.length > 0) after(() => notificationService.deliver(notices));
});

/** The signed-in trader, with any lapsed escrows already refunded — for loaders that show escrow money. */
export async function requireSettledViewer() {
  const userId = await requireUserId();
  await expireViewerEscrows(userId);
  return userId;
}
