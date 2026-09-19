import Link from "next/link";
import { Dot, PingDot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import type { MobileShell } from "../../../shell.types";

export function MobileHeader({ shell }: { shell: MobileShell }) {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 pt-safe shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-space-sm px-margin">
        <div className="flex min-w-0 items-center gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <Icon
              name="sports_esports"
              className="text-[22px] text-primary drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            />
            <span className="font-headline-sm text-headline-sm tracking-wider whitespace-nowrap text-text-primary uppercase">
              {shell.brand.name}
              <span className="ml-1 text-primary">{shell.brand.accent}</span>
            </span>
          </div>
          <div className="hidden items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:flex">
            <Dot className="h-1.5 w-1.5 bg-status-live" animation="pulse" />
            <span className="font-label-badge text-label-badge text-text-secondary uppercase">{shell.tierBadge}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-space-sm">
          <Link
            href="#"
            className="flex h-8 items-center gap-1.5 rounded-full bg-surface-card/90 px-2.5 shadow-[0_0_12px_-2px_rgba(239,68,68,0.35)]"
          >
            <PingDot sizeClassName="h-2 w-2" colorClassName="bg-status-live" />
            <span className="font-label-badge text-label-badge tracking-widest text-text-primary uppercase">
              {shell.liveCount} Live
            </span>
          </Link>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface-glass text-on-surface transition-transform hover:text-text-primary active:scale-95"
          >
            <Icon name="notifications" className="text-[20px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(244,63,94,0.8)] ring-2 ring-surface" />
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary ring-2 ring-border-subtle">
            <Icon name="person" className="text-[18px] text-on-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
