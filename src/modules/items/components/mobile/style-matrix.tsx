"use client";

import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { itemSearchParams } from "../../lib/search-params";
import type { ItemMobile } from "../../mobile.types";

/** Name block and the three-style selector; the chosen style is shared with desktop via `?style=`. */
export function StyleMatrix({ item }: { item: ItemMobile }) {
  const [style, setStyle] = useQueryState("style", itemSearchParams.style.withOptions({ history: "replace", clearOnDefault: true }));
  const activeId = item.styles.some((entry) => entry.id === style) ? style : item.defaultStyle;
  const active = item.styles.find((entry) => entry.id === activeId) ?? item.styles[0];

  const choose = (id: string, label: string) => {
    void setStyle(id === item.defaultStyle ? null : id);
    toast(`Previewing ${label}`);
  };

  return (
    <div className="flex flex-col gap-space-sm bg-canvas-base px-space-md py-space-md">
      <div className="flex flex-col">
        <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase">{item.eyebrow}</span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-text-primary">{item.name}</h2>
        <p className="mt-0.5 font-body-sm text-body-sm text-text-secondary">{item.description}</p>
      </div>

      <div className="mt-space-xs flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Active Style Matrix</span>
          <span className="font-label-badge text-label-badge font-bold text-primary">{active.label}</span>
        </div>
        <div className="grid grid-cols-3 gap-space-xs">
          {item.styles.map((entry) => {
            const current = entry.id === active.id;
            return (
              <Button
                key={entry.id}
                variant={null}
                size={null}
                aria-pressed={current}
                onClick={() => choose(entry.id, entry.label)}
                className={cn(
                  "block h-auto min-w-0 rounded-xl border-0 p-space-sm text-left whitespace-normal transition-all",
                  current
                    ? "bg-primary-container text-on-primary shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                    : "bg-surface-container-low hover:bg-surface-container",
                )}
              >
                <span
                  className={cn(
                    "block font-label-badge text-label-badge",
                    current ? "font-semibold text-on-primary-container" : "text-text-muted",
                  )}
                >
                  {entry.requirement}
                </span>
                <span className={cn("mt-0.5 block truncate font-label-caps text-label-caps", current ? "font-bold" : "text-text-primary")}>
                  {entry.name}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
