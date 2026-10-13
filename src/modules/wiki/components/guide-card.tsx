"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { WikiGuide, WikiTone } from "../types";

export const WIKI_TONE: Record<WikiTone, string> = {
  primary: "text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
  muted: "text-text-muted",
};

export function GuideCard({ guide, wide }: { guide: WikiGuide; wide: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-xl",
        wide ? "lg:col-span-7" : "lg:col-span-5",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl",
          guide.tone === "primary"
            ? "bg-primary/10"
            : guide.tone === "cyan"
              ? "bg-status-upcoming/10"
              : guide.tone === "amber"
                ? "bg-tertiary/10"
                : "bg-secondary/10",
        )}
      />
      <div className="relative">
        <div className="mb-space-sm flex items-center justify-between">
          <span
            className={cn(
              "rounded bg-surface-container-high px-space-sm py-0.5 font-label-badge text-label-badge uppercase",
              WIKI_TONE[guide.categoryTone],
            )}
          >
            {guide.category}
          </span>
          <span className="font-data-mono-md text-[11px] text-text-muted">
            DOC ID: #{guide.id.toUpperCase()}
          </span>
        </div>
        <h3 className="flex items-center gap-space-xs font-headline-md text-headline-md text-text-primary group-hover:text-primary">
          {guide.title}{" "}
          <Icon name="arrow_forward" className="text-[18px] text-text-muted" />
        </h3>
        <p className="mt-space-xs text-text-secondary">{guide.summary}</p>
        {guide.kind === "phase" && (
          <div className="mt-space-md grid grid-cols-2 gap-space-sm sm:grid-cols-4">
            {["Dark Violet", "Pink Galaxy", "Deep Cyan", "Tier 1 Ocean"].map(
              (phase, index) => (
                <div
                  key={phase}
                  className="rounded bg-surface-container-lowest p-space-sm"
                >
                  <span className="font-label-badge text-[10px] text-text-muted">
                    PHASE {index + 1}
                  </span>
                  <span className="mt-1 block font-headline-sm text-sm text-text-primary">
                    {phase}
                  </span>
                  <span className="mt-2 block h-1 rounded bg-surface-container-high">
                    <span
                      className={cn(
                        "block h-full rounded",
                        index === 1
                          ? "w-[88%] bg-primary"
                          : index === 2
                            ? "w-[40%] bg-status-upcoming"
                            : "w-[70%] bg-secondary",
                      )}
                    />
                  </span>
                </div>
              ),
            )}
          </div>
        )}
        {guide.kind === "seed" && (
          <div className="mt-space-md rounded bg-surface-container-lowest p-space-md">
            <div className="flex justify-between font-data-mono-md text-xs">
              <span>Pattern Seed #661 (The Scar)</span>
              <b className="text-tertiary">98.42% Blue</b>
            </div>
            <div className="mt-2 h-2 rounded bg-surface-container-high">
              <div className="h-full w-[98%] rounded bg-status-upcoming" />
            </div>
            <div className="mt-2 h-2 rounded bg-surface-container-high">
              <div className="h-full w-[94%] rounded bg-secondary" />
            </div>
          </div>
        )}
        {guide.kind === "gem" && (
          <div className="mt-space-md grid grid-cols-3 gap-2">
            {["Creator's Light", "Ember Flame", "Sea Green"].map((gem) => (
              <div
                key={gem}
                className="rounded bg-surface-container-lowest p-3 text-center"
              >
                <span className="mx-auto mb-2 block h-5 w-5 rounded bg-tertiary" />
                <span className="font-label-badge text-[10px] text-text-primary">
                  {gem}
                </span>
              </div>
            ))}
          </div>
        )}
        {guide.kind === "formula" && (
          <div className="mt-space-md rounded bg-surface-container-lowest p-space-md font-data-mono-md text-xs text-tertiary">
            Outcome_Float = (Max_Float - Min_Float) × Average(Input_Floats) + Min_Float
          </div>
        )}
      </div>
      <div className="relative mt-space-md flex items-center justify-between border-t border-white/6 pt-space-sm">
        <span className="font-label-badge text-label-badge text-text-muted">
          {guide.meta}
        </span>
        <Button
          type="button"
          onClick={() => {
            const el = document.getElementById("articles");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            toast.info(`Opened research codex: ${guide.title}`);
          }}
          className="inline-flex h-auto cursor-pointer items-center gap-1 rounded bg-surface-container-high px-space-md py-space-xs font-headline-sm text-[12px] text-text-primary uppercase transition-colors hover:bg-surface-container-highest"
        >
          <span>Read Research</span>
          <Icon name="chevron_right" className="text-[14px]" />
        </Button>
      </div>
    </article>
  );
}
