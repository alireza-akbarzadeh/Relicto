import { timingSafeEqual } from "node:crypto";
import { after, type NextRequest } from "next/server";
import { escrowEvent } from "@/server/modules/escrow/escrow.schema";
import { escrowService } from "@/server/modules/escrow/escrow.service";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/**
 * Escrow webhook. Trade bots report each step of an order here — offer sent,
 * delivered, cancelled — and the order, wallets and notifications move with it.
 * Authenticated with a shared secret; repeats are safe and answer `unchanged`.
 */

function authorized(request: NextRequest) {
  const secret = process.env.ESCROW_WEBHOOK_SECRET;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || given.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

export async function POST(request: NextRequest) {
  if (!process.env.ESCROW_WEBHOOK_SECRET) return Response.json({ error: "escrow webhook disabled" }, { status: 503 });
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = escrowEvent.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid event", issues: parsed.error.issues }, { status: 400 });

  const event = parsed.data;
  const result =
    event.type === "offer_sent"
      ? await escrowService.offerSent(event.orderCode, event)
      : event.type === "delivered"
        ? await escrowService.delivered(event.orderCode)
        : await escrowService.cancelled(event.orderCode, event.reason);

  if (result.status === "not-found") return Response.json({ status: result.status }, { status: 404 });
  if (result.status === "applied") after(() => notificationService.deliver(result.notices));
  return Response.json({ status: result.status });
}
