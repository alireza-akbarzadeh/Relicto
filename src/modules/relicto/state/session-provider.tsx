"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useNotificationFeed } from "../hooks/use-notification-feed";
import type { AppNotification, SessionUser } from "../session-types";

type SessionState = {
  /** Null for a guest browsing the public catalog. */
  user: SessionUser | null;
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

type SessionProviderProps = {
  user: SessionUser | null;
  notifications: AppNotification[];
  children: ReactNode;
};

/** Client session for the Relicto app: the signed-in trader (or a guest) and their live notifications. */
export function SessionProvider({ user, notifications: initial, children }: SessionProviderProps) {
  const { notifications, markRead, markAllRead } = useNotificationFeed(initial, user !== null);

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

/** The signed-in trader, or null for a guest (and outside the app shell). */
export function useViewer(): SessionUser | null {
  return useContext(SessionContext)?.user ?? null;
}

/** The signed-in session. Only for components that render behind `useViewer()` or on account-only pages. */
export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside <SessionProvider>.");
  if (!session.user) throw new Error("useSession needs a signed-in trader; guard the component with useViewer().");
  return { ...session, user: session.user };
}
