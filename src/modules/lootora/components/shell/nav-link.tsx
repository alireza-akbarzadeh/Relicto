"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import type { NavItem } from "../../session.types";

/** Link styles per header family; `active` is each design's `data-active-classes`. */
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
} as const;

export type NavStyle = keyof typeof STYLES;

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, variant }: { items: NavItem[]; variant: NavStyle }) {
  const pathname = usePathname();
  const style = STYLES[variant];

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
        {item.label}
      </Link>
    );
  });
}
