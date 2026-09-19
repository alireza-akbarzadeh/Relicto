"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AppNotification, SessionUser } from "../session.types";

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

/** Client session for the Lootora app: the signed-in trader and their notifications. */
export function SessionProvider({ user, notifications: initial, children }: SessionProviderProps) {
  const [notifications, setNotifications] = useState(initial);

  const markRead = useCallback((id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
  }, []);

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
