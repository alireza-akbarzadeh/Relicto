import "server-only";

import type { IconName } from "@/components/ui/icon";
import type { AppNotification } from "@/modules/relicto/session-types";
import { ago } from "../shared/ago";
import type { NotificationDraft } from "./notifications.catalog";
import { sendPush } from "./notifications.push";
import * as repository from "./notifications.repository";
import type { Executor, NotificationRow } from "./notifications.repository";

const toAppNotification = (row: NotificationRow, now: Date): AppNotification => ({
  id: row.id,
  icon: row.icon as IconName,
  tone: row.tone,
  title: row.title,
  body: row.body,
  time: ago(row.createdAt, now),
  href: row.href ?? "/orders",
  unread: row.unread,
});

export type PushSubscriptionInput = { endpoint: string; p256dh: string; auth: string; userAgent: string | null };

export const notificationService = {
  /**
   * Records notifications inside the caller's transaction, so the bell and the
   * trade can never disagree. Hand the result to `deliver` once it commits.
   */
  record(executor: Executor, drafts: NotificationDraft[]) {
    return repository.insertNotifications(executor, drafts);
  },

  /** Device push for rows already committed. */
  deliver(rows: NotificationRow[]) {
    return sendPush(rows);
  },

  /** The bell: newest first. */
  async feed(userId: string, now = new Date()): Promise<AppNotification[]> {
    return (await repository.findFeed(userId)).map((row) => toAppNotification(row, now));
  },

  markRead: repository.markRead,
  markAllRead: repository.markAllRead,

  subscribe: (userId: string, sub: PushSubscriptionInput) => repository.upsertSubscription(userId, sub),
  unsubscribe: (userId: string, endpoint: string) => repository.deleteSubscription(userId, endpoint),
};
