"use client";

import { useQueryState } from "nuqs";
import { itemSearchParams } from "../../lib/search-params";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { ArcanaStyle } from "../../types";

const REQUIREMENT = { muted: "text-text-muted", cyan: "font-bold text-status-upcoming", amber: "font-bold text-tertiary" };

/** The three arcana styles; the equipped one is highlighted. */
export function StyleProgression({ styles, unlocked }: { styles: ArcanaStyle[]; unlocked: string }) {
  const fallback = styles.find((style) => style.active)?.id ?? styles[0].id;
  const [selected, setSelected] = useQueryState("style", itemSearchParams.style.withOptions({ history: "replace", clearOnDefault: true }));
  const active = selected || fallback;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-card p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="auto_fix_high" className="text-[20px] text-tertiary" />
          <span className="font-headline-sm text-sm font-bold tracking-wider text-text-primary uppercase">Arcana Style Progression</span>
        </div>
        <span className="rounded border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 font-label-badge text-[10px] font-bold text-emerald-400">
          {unlocked}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {styles.map((style) => {
          const isActive = style.id === active;
          return (
            <Button
              key={style.id}
              variant={null}
              size={null}
              onClick={() => void setSelected(style.id === fallback ? "" : style.id)}
              aria-pressed={isActive}
              className={cn(
                "group relative h-auto flex-col items-stretch overflow-hidden rounded p-3 text-left font-normal whitespace-normal transition-all",
                isActive
                  ? "border-border-tactical bg-surface-container-high shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "border-border-subtle bg-surface-container-lowest hover:border-tertiary/40 hover:bg-surface-container",
              )}
            >
              {isActive && <span className="absolute top-0 right-0 h-8 w-8 translate-x-3 -translate-y-3 rotate-45 bg-tertiary/20" />}
              <span className="flex items-center justify-between">
                <span className={cn("font-label-caps text-[11px] font-bold", isActive ? "text-tertiary" : "text-text-muted group-hover:text-text-primary")}>
                  {style.label}
                </span>
                <span className={cn("font-data-mono-md text-[10px]", isActive ? "font-bold text-tertiary" : REQUIREMENT[style.requirementTone])}>
                  {style.requirement}
                </span>
              </span>
              <span className={cn("mt-1 truncate font-body-sm text-xs", isActive ? "font-bold text-text-primary" : "font-medium text-text-secondary")}>
                {style.name}
              </span>
              <span className={cn("mt-2 block font-label-badge text-[10px]", isActive ? "font-medium text-tertiary" : "text-text-muted")}>{style.note}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
