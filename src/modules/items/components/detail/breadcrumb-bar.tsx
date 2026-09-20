import Link from "next/link";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import type { ItemDetail } from "../../types";

/** Category trail plus the Steam sync and Valve id chips. */
export function BreadcrumbBar({ item }: { item: ItemDetail }) {
  return (
    <section className="w-full border-b border-border-subtle bg-surface-container-lowest/80 px-4 py-2.5 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 md:flex-row md:items-center">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs">
          {item.breadcrumb.map((crumb, index) => (
            <span key={crumb.label} className="contents">
              {index > 0 && <Icon name="chevron_right" className="text-[14px] text-text-muted" />}
              {crumb.href ? (
                <Link href={crumb.href} className="text-text-muted transition-colors hover:text-tertiary">
                  {crumb.label}
                </Link>
              ) : crumb.chip ? (
                <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-[11px] font-semibold text-status-live">{crumb.label}</span>
              ) : (
                <span className="font-medium text-text-primary">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded border border-border-subtle bg-surface-container px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-data-mono-md text-[11px] text-text-secondary">Steam API Synced · {item.syncedAgo}</span>
            <NoticeButton
              notice={{ title: "Cache recalculated", description: "Live Steam pricing refreshes once the API is wired." }}
              aria-label="Force cache recalculation"
              className="ml-1 inline-block h-auto rounded-none border-0 p-0 text-text-muted transition-colors hover:text-tertiary"
            >
              <Icon name="sync" className="text-[15px]" />
            </NoticeButton>
          </div>
          <div className="hidden items-center gap-1.5 rounded border border-border-subtle bg-surface-container-high px-2.5 py-1 sm:flex">
            <span className="font-data-mono-md text-[11px] font-bold text-tertiary">APPID: {item.appId}</span>
            <span className="text-[10px] text-text-muted">•</span>
            <span className="font-data-mono-md text-[11px] text-text-secondary">CLASSID: {item.classId}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
