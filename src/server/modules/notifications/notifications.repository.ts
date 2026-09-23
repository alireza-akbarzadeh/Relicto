import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications, pushSubscriptions } from "@/lib/db/schema";
import type { NotificationDraft } from "./notifications.catalog";

/** The pool or an open transaction — notifications are written alongside the change they report. */
export type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Stores drafts, skipping any already delivered. Returns only the new rows. */
export async function insertNotifications(executor: Executor, drafts: NotificationDraft[]) {
  if (drafts.length === 0) return [];
  return executor.insert(notifications).values(drafts).onConflictDoNothing({ target: notifications.dedupeKey }).returning();
}

export type NotificationRow = Awaited<ReturnType<typeof insertNotifications>>[number];

export async function findFeed(userId: string, limit = 20) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markRead(userId: string, id: string) {
  await db
    .update(notifications)
    .set({ unread: false })
    .where(and(eq(notifications.userId, userId), eq(notifications.id, id)));
}

export async function markAllRead(userId: string) {
  await db
    .update(notifications)
    .set({ unread: false })
    .where(and(eq(notifications.userId, userId), eq(notifications.unread, true)));
}

type Subscription = { endpoint: string; p256dh: string; auth: string; userAgent: string | null };

/** A browser that re-subscribes (or changes hands) is re-bound to whoever is signed in. */
export async function upsertSubscription(userId: string, sub: Subscription) {
  await db
    .insert(pushSubscriptions)
    .values({ userId, ...sub })
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: { userId, ...sub, updatedAt: new Date() } });
}

export async function deleteSubscription(userId: string, endpoint: string) {
  await db
    .delete(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));
}

export async function findSubscriptions(userIds: string[]) {
  if (userIds.length === 0) return [];
  return db.select().from(pushSubscriptions).where(inArray(pushSubscriptions.userId, userIds));
}

/** The push service said this browser is gone for good. */
export async function dropSubscription(id: string) {
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
}

export async function touchSubscription(id: string) {
  await db.update(pushSubscriptions).set({ lastSuccessAt: new Date() }).where(eq(pushSubscriptions.id, id));
}
