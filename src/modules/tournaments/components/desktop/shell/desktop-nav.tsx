import Link from "next/link";
import { cn } from "@/lib/cn";
import type { NavLink } from "../../../shell.types";

type DesktopNavProps = { links: NavLink[]; activeId: string };

export function DesktopNav({ links, activeId }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-space-xs rounded-xl bg-surface-container-low/60 p-space-xs lg:flex">
      {links.map((link) => {
        const isActive = link.id === activeId;
        return (
          <Link
            key={link.id}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded px-space-md py-space-sm tracking-wide uppercase transition-colors",
              isActive
                ? "bg-surface-container-high font-bold text-primary"
                : "font-headline-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
