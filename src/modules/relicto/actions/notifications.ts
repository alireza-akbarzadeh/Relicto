"use server";

import { headers } from "next/headers";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { endpointInput, markReadInput, pushSubscriptionInput } from "@/server/modules/notifications/notifications.schema";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/** Bell and device-push writes. Each checks the session itself, and only ever touches the caller's rows. */

export async function markNotificationRead(input: z.input<typeof markReadInput>) {
  const { id } = markReadInput.parse(input);
  await notificationService.markRead(await requireUserId(), id);
}

export async function markAllNotificationsRead() {
  await notificationService.markAllRead(await requireUserId());
}

export async function savePushSubscription(input: z.input<typeof pushSubscriptionInput>) {
  const { endpoint, keys } = pushSubscriptionInput.parse(input);
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  await notificationService.subscribe(await requireUserId(), { endpoint, ...keys, userAgent });
}

export async function removePushSubscription(input: z.input<typeof endpointInput>) {
  const { endpoint } = endpointInput.parse(input);
  await notificationService.unsubscribe(await requireUserId(), endpoint);
}
