"use client";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { useSession } from "../../state/session-provider";
import { NotificationItem } from "./notification-item";

type TriggerStyle = { button: string; badge: string; icon?: ReactNode; ping?: boolean };

const TRIGGERS = {
  count: {
    button:
      "group relative flex h-10 items-center justify-center rounded-xl border border-white/10 bg-surface-container-low/80 px-3 text-text-secondary transition-all duration-200 hover:border-tertiary/40 hover:bg-surface-container-high hover:text-text-primary active:scale-95 backdrop-blur-md",
    badge:
      "ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-tertiary px-1.5 font-data-mono-md text-[10px] font-bold text-on-tertiary shadow-[0_0_10px_rgba(245,158,11,0.4)]",
  },
  dot: {
    button:
      "group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface-container-low/80 text-text-secondary transition-all duration-200 hover:border-white/20 hover:bg-surface-container-high hover:text-text-primary active:scale-95 backdrop-blur-md",
    badge:
      "absolute top-2 right-2 h-2 w-2 rounded-full bg-status-live shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  },
  square: {
    button:
      "group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface-container-low/80 text-text-secondary transition-all hover:border-white/20 hover:bg-surface-container-high hover:text-text-primary active:scale-95",
    badge:
      "absolute top-2 right-2 h-2 w-2 rounded-full bg-status-live shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  },
  vault: {
    button:
      "group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface-container-lowest text-text-secondary hover:text-text-primary hover:bg-surface-container transition-all active:scale-95",
    badge: "absolute top-2 right-2 h-2 w-2 rounded-full bg-primary",
  },
  hub: {
    button:
      "group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface-card text-text-secondary hover:text-white hover:border-white/20 transition-all active:scale-95",
    badge: "absolute top-2 right-2 h-2 w-2 rounded-full bg-status-live",
    icon: <Bell className="size-4" />,
    ping: true,
  },
  mobile: {
    button:
      "relative w-11 h-11 flex items-center justify-center rounded-xl border border-white/10 bg-surface-card/60 text-text-secondary hover:text-text-primary transition-colors active:scale-95",
    badge:
      "absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]",
    icon: <Icon name="notifications" className="text-[20px]" />,
  },
  mobileLinked: {
    button:
      "relative w-11 h-11 flex items-center justify-center rounded-xl border border-white/10 bg-surface-container-low text-on-surface-variant hover:text-text-primary transition-colors active:scale-95",
    badge:
      "absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-live shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    icon: <Icon name="notifications" className="text-[20px]" />,
  },
} satisfies Record<string, TriggerStyle>;

export type NotificationsTrigger = keyof typeof TRIGGERS;

/** Inner Content shared between Popover and Drawer */
function NotificationsInnerContent({ onClose }: { onClose?: () => void }) {
  const { notifications, unreadCount, markRead, markAllRead } = useSession();

  const openItem = (id: string) => {
    markRead(id);
    onClose?.();
  };

  return (
    <div className="flex flex-col overflow-hidden">
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
      <div className="flex max-h-95 flex-col divide-y divide-white/5 overflow-y-auto p-1.5 [scrollbar-width:thin]">
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
          onClick={onClose}
          className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 text-xs font-semibold text-text-secondary transition-all hover:bg-surface-container-high hover:text-text-primary active:scale-[0.98]"
        >
          <span>Open activity ledger</span>
          <Icon
            name="arrow_forward"
            className="text-[14px] transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}

export function NotificationsMenu({ trigger }: { trigger: NotificationsTrigger }) {
  const { unreadCount } = useSession();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const style: TriggerStyle = TRIGGERS[trigger];

  const renderTrigger = (props: React.ComponentPropsWithoutRef<"button">) => (
    <button
      {...props}
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
    </button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <DrawerTrigger render={renderTrigger} />
        <DrawerContent className="bg-surface-card border-t border-white/10 p-0 overflow-hidden">
          <NotificationsInnerContent onClose={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={renderTrigger} />
      <PopoverContent
        align="end"
        className="w-90 sm:w-95 p-0 border border-white/10 bg-surface-card/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden"
      >
        <NotificationsInnerContent onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}