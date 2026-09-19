import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { AppNotification, NotificationTone } from "../../session.types";

const TONE: Record<NotificationTone, string> = {
  success: "bg-status-upcoming/15 text-status-upcoming",
  warning: "bg-tertiary-container/25 text-tertiary",
  info: "bg-secondary-container/30 text-secondary",
  alert: "bg-primary-container/20 text-primary",
};

type NotificationItemProps = { notification: AppNotification; onOpen: (id: string) => void };

export function NotificationItem({ notification: n, onOpen }: NotificationItemProps) {
  return (
    <Link
      href={n.href}
      onClick={() => onOpen(n.id)}
      className="group flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-container-high"
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TONE[n.tone])}>
        <Icon name={n.icon} className="text-[18px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate font-headline-sm text-[13px] font-semibold",
              n.unread ? "text-text-primary" : "text-text-secondary",
            )}
          >
            {n.title}
          </span>
          <span className="shrink-0 font-data-mono-md text-[10px] text-text-muted">{n.time}</span>
        </span>
        <span className="line-clamp-2 font-body-sm text-[12px] leading-[18px] text-text-muted">{n.body}</span>
      </span>
      {n.unread && <span aria-label="Unread" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-container" />}
    </Link>
  );
}
