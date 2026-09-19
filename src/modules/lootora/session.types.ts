import type { IconName } from "@/components/ui/icon";

export type SessionUser = {
  handle: string;
  level: number;
  role: string;
  verified: boolean;
  steamSynced: boolean;
  walletUsd: number;
};

export type NotificationTone = "success" | "warning" | "info" | "alert";

export type AppNotification = {
  id: string;
  icon: IconName;
  tone: NotificationTone;
  title: string;
  body: string;
  /** Relative time label, e.g. "2m ago". */
  time: string;
  href: string;
  unread: boolean;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** Designed in the nav but no screen exists yet — clicking explains instead of 404ing. */
  comingSoon?: boolean;
};
