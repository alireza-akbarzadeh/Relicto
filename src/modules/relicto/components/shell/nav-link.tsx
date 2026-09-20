"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import type { NavItem } from "../../session-types";

/** Link styles per header family; `active` is each design's `data-active-classes`. */
type LinkStyle = { base: string; idle: string; active: string; dot?: string };

const STYLES = {
  market: {
    base: "px-space-sm py-1.5 rounded tracking-wider uppercase transition-all",
    idle: "font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
    active: "bg-surface-container text-text-primary font-bold",
  },
  ledger: {
    base: "px-space-md py-space-sm transition-colors uppercase tracking-wider",
    idle: "font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
    active: "bg-primary-container text-on-primary-container font-semibold rounded-lg shadow-[0_0_12px_rgba(244,63,94,0.35)]",
  },
  studio: {
    base: "px-3 py-2 uppercase tracking-wider transition-all",
    idle: "text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high hover:text-on-surface",
    active: "bg-primary-container text-on-primary-container font-headline-sm text-label-caps",
  },
  vault: {
    base: "px-3 py-1.5 rounded transition-all text-xs",
    idle: "text-text-secondary font-medium hover:bg-surface-container hover:text-text-primary",
    active: "bg-surface-container-high text-tertiary border border-border-tactical font-semibold",
  },
  hub: {
    base: "px-3 py-1.5 rounded transition-all",
    idle: "text-text-secondary hover:text-white hover:bg-surface-container",
    active: "text-white bg-surface-container-high border border-surface-bright shadow-xs flex items-center gap-1.5",
    /** Pulsing marker drawn before the active label. */
    dot: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse",
  },
} satisfies Record<string, LinkStyle>;

export type NavStyle = keyof typeof STYLES;

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, variant }: { items: NavItem[]; variant: NavStyle }) {
  const pathname = usePathname();
  const style: LinkStyle = STYLES[variant];

  return items.map((item) => {
    const active = !item.comingSoon && isActivePath(pathname, item.href);
    const className = cn(style.base, active ? style.active : style.idle);

    if (item.comingSoon) {
      return (
        <button
          key={item.id}
          type="button"
          className={className}
          onClick={() => toast(`${item.label} is on the roadmap`, { description: "This screen hasn't been designed yet." })}
        >
          {item.label}
        </button>
      );
    }
    return (
      <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined} className={className}>
        {active && style.dot && <span className={style.dot} />}
        {item.label}
      </Link>
    );
  });
}
