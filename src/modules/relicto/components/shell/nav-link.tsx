import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { NavItem } from "../../session-types";

type LinkStyle = {
  container?: string;
  base: string;
  idle: string;
  active: string;
  dot?: string;
};

const STYLES = {
  market: {
    container: "flex items-center gap-1",
    base: "relative flex items-center gap-2 px-3 py-1.5 rounded-lg font-label-caps text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95",
    idle: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60",
    active: "bg-surface-container text-text-primary shadow-xs border border-white/5",
  },
  ledger: {
    container: "flex items-center gap-1.5",
    base: "relative flex items-center gap-2 px-3.5 py-2 rounded-lg font-label-caps text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95",
    idle: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50",
    active: "bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(244,63,94,0.3)] border border-primary/20",
  },
  studio: {
    container: "flex items-center gap-1",
    base: "relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-headline-sm text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95",
    idle: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60",
    active: "bg-surface-container-high text-primary border border-primary/30 shadow-xs",
    dot: "h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]",
  },
  vault: {
    container: "flex items-center gap-1",
    base: "relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 active:scale-95",
    idle: "text-text-secondary hover:bg-surface-container/60 hover:text-text-primary",
    active: "bg-surface-container-high text-tertiary border border-border-tactical font-semibold shadow-xs",
  },
  hub: {
    container: "flex items-center gap-1",
    base: "relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95",
    idle: "text-text-secondary hover:text-white hover:bg-surface-container/60",
    active: "text-white bg-surface-container-high border border-white/10 shadow-xs",
    dot: "h-1.5 w-1.5 rounded-full bg-status-live animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]",
  },
  mobile: {
    container: "flex flex-col gap-1 w-full",
    base: "relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
    idle: "text-text-secondary hover:bg-white/5 hover:text-text-primary",
    active: "bg-surface-container-high text-primary font-semibold border border-primary/20",
    dot: "h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]",
  },
} satisfies Record<string, LinkStyle>;

export type NavStyle = keyof typeof STYLES;

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, variant }: { items: NavItem[]; variant: NavStyle }) {
  const pathname = usePathname();
  const style: LinkStyle = STYLES[variant];

  return (
    <div className={style.container}>
      {items.map((item) => {
        const active = !item.comingSoon && isActivePath(pathname, item.href);
        const className = cn(style.base, active ? style.active : style.idle);

        if (item.comingSoon) {
          return (
            <button
              key={item.id}
              type="button"
              className={cn(className, "opacity-75 cursor-not-allowed")}
              onClick={() =>
                toast(`${item.label} is on the roadmap`, {
                  description: "This screen hasn't been designed yet.",
                })
              }
            >
              <div className="flex items-center gap-1.5">
                {item.icon && typeof item.icon === "string" ? (
                  <Icon name={item.icon} className="text-[16px]" />
                ) : (
                  item.icon
                )}
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="ml-auto rounded bg-surface-container-high/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-text-muted border border-white/5">
                Soon
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={className}
          >
            <div className="flex items-center gap-2">
              {active && style.dot && <span className={style.dot} />}
              {item.icon && typeof item.icon === "string" ? (
                <Icon name={item.icon} className="text-[16px]" />
              ) : (
                item.icon
              )}
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}