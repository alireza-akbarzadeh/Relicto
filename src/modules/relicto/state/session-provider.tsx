"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useNotificationFeed } from "../hooks/use-notification-feed";
import type { AppNotification, SessionUser } from "../session-types";

type SessionState = {
  user: SessionUser;
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

type SessionProviderProps = {
  user: SessionUser;
  notifications: AppNotification[];
  children: ReactNode;
};

/** Client session for the Relicto app: the signed-in trader and their live notifications. */
export function SessionProvider({ user, notifications: initial, children }: SessionProviderProps) {
  const { notifications, markRead, markAllRead } = useNotificationFeed(initial);

  const value = useMemo(
    () => ({
      user,
      notifications,
      unreadCount: notifications.filter((n) => n.unread).length,
      markRead,
      markAllRead,
    }),
    [user, notifications, markRead, markAllRead],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside <SessionProvider>.");
  return session;
}
