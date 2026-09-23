import "server-only";

import webpush, { WebPushError } from "web-push";
import * as repository from "./notifications.repository";
import type { NotificationRow } from "./notifications.repository";

/** What the service worker receives; `public/sw.js` reads exactly these keys. */
export type PushPayload = { title: string; body: string; href: string; tag: string };

let configured: boolean | null = null;

/** VAPID keys identify Relicto to the browsers' push services. Without them, push is off. */
function configure() {
  if (configured !== null) return configured;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  configured = Boolean(publicKey && privateKey && subject);

  if (configured) webpush.setVapidDetails(subject!, publicKey!, privateKey!);
  else console.warn("[push] VAPID keys missing; in-app notifications only.");
  return configured;
}

/** A trade offer is waiting on the buyer, so it goes out ahead of routine updates. */
const urgency = (row: NotificationRow) => (row.kind === "trade_offer_sent" ? "high" : "normal");

/**
 * Sends each new notification to every device its owner subscribed. Runs after
 * the change has committed; a dead device is forgotten, any other failure is
 * logged and never undoes the trade.
 */
export async function sendPush(rows: NotificationRow[]) {
  if (rows.length === 0 || !configure()) return;

  const subscriptions = await repository.findSubscriptions([...new Set(rows.map((row) => row.userId))]);

  await Promise.all(
    rows.flatMap((row) =>
      subscriptions
        .filter((sub) => sub.userId === row.userId)
        .map(async (sub) => {
          const payload: PushPayload = { title: row.title, body: row.body, href: row.href ?? "/orders", tag: row.id };
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              JSON.stringify(payload),
              { TTL: 24 * 60 * 60, urgency: urgency(row) },
            );
            await repository.touchSubscription(sub.id);
          } catch (error) {
            if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) {
              await repository.dropSubscription(sub.id);
            } else {
              console.error("[push] delivery failed", sub.id, error);
            }
          }
        }),
    ),
  );
}
