import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/mobile-tones";
import type { QuickLink } from "../../mobile.types";

const BADGE: Record<NonNullable<QuickLink["badge"]>["style"], string> = {
  "cyan-pill": "rounded-full bg-status-upcoming/20 font-data-mono-md text-[11px] font-bold text-status-upcoming",
  plain: "rounded bg-surface-container-lowest font-data-mono-md text-[11px] text-text-primary",
  "crimson-pill": "rounded-full bg-primary-container/20 font-label-badge text-[10px] font-bold text-primary-container",
};

/** Shortcuts into orders, ledger, listings, alerts and bot security. */
export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-card shadow-md">
      {links.map((link) => (
        <Link key={link.id} href={link.href} className="flex items-center justify-between bg-surface-card p-space-md transition-colors hover:bg-surface-container-high">
          <div className="flex min-w-0 items-center gap-space-sm">
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest", TONE_TEXT[link.tone])}>
              <Icon name={link.icon} className="text-[20px]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-headline-sm text-[14px] text-text-primary">{link.title}</span>
              <span className="font-body-sm text-[12px] text-text-muted">{link.note}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {link.badge && <span className={cn("px-2 py-0.5", BADGE[link.badge.style])}>{link.badge.text}</span>}
            <Icon name="chevron_right" className="text-[18px] text-text-muted" />
          </div>
        </Link>
      ))}
    </div>
  );
}
