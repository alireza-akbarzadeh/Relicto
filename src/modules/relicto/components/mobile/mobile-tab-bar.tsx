import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { MOBILE_TABS, type MobileTabFamily } from "../../data/mobile-navigation";

/** Classes per tab-bar family, transcribed from each Stitch bottom nav. */
const STYLE = {
  market: {
    nav: "bg-surface-deep/85 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]",
    row: "px-space-xs",
    tab: "min-w-[56px] py-1 px-2 rounded-lg transition-all",
    idle: "text-text-secondary hover:text-text-primary",
    active: "text-primary bg-primary/10 shadow-[0_0_16px_rgba(244,63,94,0.2)]",
    icon: "text-[22px]",
    label: "mt-0.5 font-label-caps text-label-caps uppercase",
  },
  linked: {
    nav: "bg-surface-dim/85 shadow-[0_-1px_12px_rgba(0,0,0,0.5)]",
    row: "px-1",
    tab: "min-w-[56px] transition-all",
    idle: "text-text-secondary hover:text-text-primary",
    active: "font-headline-sm text-primary-container",
    icon: "text-[22px]",
    label: "mt-1 font-label-badge text-label-badge",
  },
  intel: {
    nav: "bg-surface-deep/90 shadow-[0_-2px_12px_rgba(0,0,0,0.4)]",
    row: "px-space-xs",
    tab: "min-w-[54px] gap-0.5 transition-colors",
    idle: "text-text-muted hover:text-on-surface",
    active: "font-semibold text-primary-container",
    icon: "text-[20px]",
    label: "font-label-badge text-label-badge tracking-wider uppercase",
  },
} satisfies Record<MobileTabFamily, Record<string, string>>;

type MobileTabBarProps = {
  family: MobileTabFamily;
  active: string;
  /** Solid glyph on the active tab (the profile screen draws it filled). */
  filled?: boolean;
};

/** Fixed bottom navigation of the mobile screens. */
export function MobileTabBar({ family, active, filled = false }: MobileTabBarProps) {
  const style = STYLE[family];

  return (
    <nav className={cn("pb-safe fixed bottom-0 z-50 w-full backdrop-blur-xl", style.nav)}>
      <div className={cn("flex h-16 items-center justify-around", style.row)}>
        {MOBILE_TABS[family].map((tab) => {
          const current = tab.id === active;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative flex min-h-[44px] flex-col items-center justify-center",
                style.tab,
                current ? style.active : style.idle,
              )}
            >
              <Icon name={tab.icon} filled={filled && current} className={style.icon} />
              <span className={style.label}>{tab.label}</span>
              {"dot" in tab && tab.dot && (
                <span className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary-container)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
