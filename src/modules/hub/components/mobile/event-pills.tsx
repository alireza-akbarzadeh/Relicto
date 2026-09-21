"use client";

import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { hubMobileSearchParams } from "../../lib/mobile-search-params";
import type { EventPill } from "../../mobile.types";

/** Tournament switch (`?event=`); the live arena card follows it. */
export function EventPills({ events }: { events: EventPill[] }) {
  const [event, setEvent] = useQueryState("event", hubMobileSearchParams.event.withOptions({ history: "replace", clearOnDefault: true }));

  return (
    <div className="flex items-center justify-between gap-space-sm px-margin pt-2">
      <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto py-1">
        {events.map((pill) => {
          const active = pill.id === event;
          return (
            <Button
              key={pill.id}
              variant={null}
              size={null}
              aria-pressed={active}
              onClick={() => void setEvent(pill.id)}
              className={cn(
                "h-auto shrink-0 gap-1.5 rounded-full border-0 px-3 py-1.5 font-headline-sm text-label-caps font-bold tracking-wider transition-all",
                active
                  ? "bg-primary-container text-on-primary shadow-[0_0_12px_rgba(255,81,106,0.35)]"
                  : "bg-surface-container-high text-on-surface-variant hover:text-text-primary",
              )}
            >
              <Icon name={pill.icon} className="text-[16px]" />
              <span>{pill.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
