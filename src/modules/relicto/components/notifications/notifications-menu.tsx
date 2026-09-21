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
    button:
      "relative p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-text-secondary hover:text-text-primary active:scale-95",
    badge:
      "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary font-label-badge text-[10px] flex items-center justify-center shadow-md",
  },
  /** Orders / tracking / profile: rounded-lg button with a pulsing dot. */
  dot: {
    button:
      "relative p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex items-center justify-center active:scale-95",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-live animate-pulse",
  },
  /** Sell / wallet: square button with a pulsing dot. */
  square: {
    button:
      "relative p-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-live animate-pulse",
  },
  /** Item vault: bordered button with a solid dot. */
  vault: {
    button:
      "relative p-2 rounded-lg bg-surface-container-lowest border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-container transition-all active:scale-95",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary",
  },
  /** Game hub: bordered button, Lucide bell, pinging dot. */
  hub: {
    button:
      "relative p-2 rounded-md bg-surface-card border border-border-dark text-text-secondary hover:text-white hover:border-surface-bright transition-all active:scale-95",
    badge: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-live",
    icon: <Bell className="size-4" />,
    ping: true,
  },
  /** Mobile market family (marketplace, tracker): 44px button, glowing dot. */
  mobile: {
    button:
      "relative w-11 h-11 flex items-center justify-center rounded-lg bg-surface-card/60 text-text-secondary hover:text-text-primary transition-colors active:scale-95",
    badge:
      "absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]",
    icon: <Icon name="notifications" className="text-[20px]" />,
  },
  /** Mobile linked family (hub, sell, wallet, alerts): rounded-xl button, live dot. */
  mobileLinked: {
    button:
      "relative w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:text-text-primary transition-colors active:scale-95",
    badge:
      "absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-live shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    icon: <Icon name="notifications" className="text-[20px]" />,
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
        {style.icon ?? <Icon name="notifications" className="text-[22px]" />}
        {unreadCount > 0 && style.ping && (
          <span className={cn(style.badge, "animate-ping opacity-75")} />
        )}
        {unreadCount > 0 && (
          <span className={style.badge}>{trigger === "count" ? unreadCount : null}</span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[360px] sm:w-[380px] p-0 border border-white/10 bg-surface-card/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-sm font-bold text-text-primary tracking-tight">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={cn(
              "text-[11px] font-medium transition-all duration-150 rounded px-2 py-1",
              unreadCount
                ? "text-tertiary hover:text-text-primary hover:bg-white/5 active:scale-95"
                : "cursor-not-allowed text-text-muted opacity-50"
            )}
          >
            Mark all read
          </button>
        </div>

        {/* List Body / Empty State */}
        <div className="flex max-h-95 flex-col divide-y divide-white/3 overflow-y-auto p-1.5 [scrollbar-width:thin]">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onOpen={openItem} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high/50 text-text-muted">
                <Icon name="notifications" className="text-[20px]" />
              </div>
              <span className="text-xs text-text-muted">All caught up! No notifications.</span>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="border-t border-white/5 p-2 bg-surface-container-low/30">
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 text-xs font-semibold text-text-secondary transition-all hover:bg-surface-container-high hover:text-text-primary active:scale-[0.98]"
          >
            <span>Open activity ledger</span>
            <Icon
              name="arrow_forward"
              className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}