"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";
import { useSession } from "../../state/session-provider";
import { NotificationItem } from "./notification-item";

type TriggerStyle = { button: string; badge: string; icon?: ReactNode; ping?: boolean };

/** Trigger styles per header family, straight from each Stitch header. */
const TRIGGERS = {
  /** Marketplace: rounded button with a numeric badge. */
  count: {
    button: "relative p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors text-text-secondary hover:text-text-primary",
    badge: "absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-container text-on-primary-container font-label-badge text-label-badge flex items-center justify-center",
  },
  /** Orders / tracking / profile: rounded-lg button with a pulsing dot. */
  dot: {
    button: "relative p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-live animate-pulse",
  },
  /** Sell / wallet: square button with a pulsing dot. */
  square: {
    button: "relative p-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-live animate-pulse",
  },
  /** Game hub: bordered button, Lucide bell, pinging dot. */
  hub: {
    button: "relative p-2 rounded-md bg-surface-card border border-border-dark text-text-secondary hover:text-white hover:border-surface-bright transition-colors",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-live",
    icon: <Bell className="size-4" />,
    ping: true,
  },
} satisfies Record<string, TriggerStyle>;

export type NotificationsTrigger = keyof typeof TRIGGERS;

export function NotificationsMenu({ trigger }: { trigger: NotificationsTrigger }) {
  const { notifications, unreadCount, markRead, markAllRead } = useSession();
  const [open, setOpen] = useState(false);
  const style: TriggerStyle = TRIGGERS[trigger];
  const openItem = (id: string) => {
    markRead(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className={style.button}
      >
        {style.icon ?? <Icon name="notifications" className="text-[20px]" />}
        {unreadCount > 0 && style.ping && <span className={cn(style.badge, "animate-ping")} />}
        {unreadCount > 0 && <span className={style.badge}>{trigger === "count" ? unreadCount : null}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-2">
        <div className="flex items-center justify-between px-2.5 pt-1.5 pb-2.5">
          <span className="flex items-center gap-2 font-headline-sm text-[15px] font-bold text-text-primary">
            Notifications
            {unreadCount > 0 && (
              <span className="rounded bg-primary-container px-1.5 font-label-badge text-[10px] text-on-primary-container">
                {unreadCount} NEW
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={cn(
              "font-label-badge text-label-badge uppercase transition-colors",
              unreadCount ? "text-tertiary hover:text-primary" : "cursor-default text-text-muted",
            )}
          >
            Mark all read
          </button>
        </div>
        <div className="flex max-h-[360px] flex-col gap-0.5 overflow-y-auto">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onOpen={openItem} />
          ))}
        </div>
        <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="mt-1.5 flex items-center justify-center gap-1 rounded-lg bg-surface-container-low py-2 font-label-caps text-label-caps text-text-secondary uppercase transition-colors hover:bg-surface-container-high hover:text-text-primary"
          >
            Open activity ledger
            <Icon name="arrow_forward" className="text-[14px]" />
          </Link>
      </PopoverContent>
    </Popover>
  );
}
