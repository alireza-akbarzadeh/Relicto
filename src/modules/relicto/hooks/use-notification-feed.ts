"use client";

import { useCallback, useEffect, useState } from "react";
import { markAllNotificationsRead, markNotificationRead } from "../actions/notifications";
import type { AppNotification } from "../session-types";

const POLL_MS = 30_000;

/**
 * The bell's list: server-rendered first, then kept fresh — at once when a push
 * arrives (the service worker pings open tabs), and on a slow poll while the tab
 * is visible, which also covers devices that declined push.
 */
export function useNotificationFeed(initial: AppNotification[]) {
  const [notifications, setNotifications] = useState(initial);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (response.ok) setNotifications((await response.json()).notifications);
    } catch {
      // Offline: keep what we have; the next tick or push tries again.
    }
  }, []);

  useEffect(() => {
    const tick = () => document.visibilityState === "visible" && void refresh();
    const timer = window.setInterval(tick, POLL_MS);
    const onMessage = (event: MessageEvent) => event.data?.type === "notifications:refresh" && void refresh();

    document.addEventListener("visibilitychange", tick);
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
    };
  }, [refresh]);

  const markRead = useCallback((id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    void markNotificationRead({ id }).catch(() => undefined);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
    void markAllNotificationsRead().catch(() => undefined);
  }, []);

  return { notifications, markRead, markAllRead, refresh };
}
