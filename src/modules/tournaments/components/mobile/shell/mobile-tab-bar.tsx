import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { MobileShell, MobileTab } from "../../../shell.types";

function TabIcon({ tab }: { tab: MobileTab }) {
  if (!tab.badge) return <Icon name={tab.icon} className="text-[20px]" />;
  return (
    <div className="relative flex items-center justify-center">
      <Icon name={tab.icon} className="text-[20px]" />
      <span className="absolute -top-0.5 -right-1 flex h-1.5 w-1.5">
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-live" />
      </span>
    </div>
  );
}

/** Floating bottom navigation, pill-shaped. */
export function MobileTabBar({ shell }: { shell: MobileShell }) {
  return (
    <nav className="pointer-events-none fixed bottom-0 z-50 w-full pb-safe">
      <div className="pointer-events-auto mx-auto max-w-md px-space-sm pb-space-sm">
        <div className="flex items-center justify-between rounded-full bg-surface-deep/90 px-space-xs py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          {shell.tabs.map((tab) => {
            const isActive = tab.id === shell.activeTab;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-12 min-w-[56px] flex-col items-center justify-center rounded-full px-space-xs transition-all duration-200 active:scale-95",
                  isActive
                    ? "bg-surface-container-high font-semibold text-text-primary shadow-[0_0_16px_rgba(244,63,94,0.28)] ring-1 ring-border-focus"
                    : "text-text-muted",
                )}
              >
                <TabIcon tab={tab} />
                <span className="mt-0.5 font-label-badge text-label-badge tracking-tight uppercase">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
