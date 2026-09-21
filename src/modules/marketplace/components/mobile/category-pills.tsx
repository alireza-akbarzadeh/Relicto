"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { CategoryPill } from "../../mobile.types";
import { useMobileMarket } from "../../state/mobile-market-provider";

/** Horizontally scrolling quick categories; the active one carries a cyan live dot. */
export function CategoryPills({ pills }: { pills: CategoryPill[] }) {
  const { criteria, set } = useMobileMarket();

  return (
    <section className="no-scrollbar -mx-space-md flex items-center gap-2 overflow-x-auto px-space-md py-0.5">
      {pills.map((pill) => {
        const active = criteria.cat === pill.id;
        return (
          <Button
            key={pill.id}
            variant={null}
            size={null}
            aria-pressed={active}
            onClick={() => set({ cat: pill.id })}
            className={cn(
              "h-auto gap-1.5 rounded-full border-0 px-3.5 py-1.5 font-label-caps text-label-caps font-bold uppercase transition-transform active:scale-95",
              active ? "bg-surface-container text-text-primary shadow-xs" : "bg-surface-container-low text-text-secondary hover:text-text-primary",
            )}
          >
            {active && <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming shadow-[0_0_8px_var(--color-status-upcoming)]" />}
            {pill.icon && <Icon name={pill.icon} className="text-[14px] text-tertiary" />}
            <span>{pill.label}</span>
          </Button>
        );
      })}
    </section>
  );
}
