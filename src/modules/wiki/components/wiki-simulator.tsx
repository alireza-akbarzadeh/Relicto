"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { SeedPatternAnalyzer } from "./seed-pattern-analyzer";

export function WikiSimulator({
  float,
  setFloat,
  computed,
}: {
  float: string;
  setFloat: (value: string) => void;
  computed: string;
}) {
  const [activeTab, setActiveTab] = useState<"float" | "seed">("float");
  const numVal = parseFloat(computed);
  const wearGrade =
    numVal < 0.07
      ? { label: "FACTORY NEW", tone: "text-status-upcoming" }
      : numVal < 0.15
        ? { label: "MINIMAL WEAR", tone: "text-primary" }
        : numVal < 0.38
          ? { label: "FIELD TESTED", tone: "text-tertiary" }
          : { label: "WELL WORN / BATTLE SCARED", tone: "text-text-muted" };

  return (
    <section className="px-margin-desktop py-space-lg">
      <div className="mx-auto max-w-7xl rounded-xl bg-surface-container-lowest p-space-lg shadow-xl border border-border-subtle">
        <div className="mb-space-md flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold flex items-center gap-1.5">
              <Icon name="auto_awesome" className="text-sm" />
              Embedded Simulator &amp; Research Lab
            </span>
            <h2 className="font-headline-lg text-headline-lg text-text-primary mt-1">
              Interactive Mathematics &amp; Seed Inspection
            </h2>
            <p className="text-text-secondary text-sm">
              Deterministic outcome calculations verified against CS2 Source 2 engine mechanics.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-surface-card p-1 border border-border-dark self-start md:self-auto">
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setActiveTab("float")}
              className={cn(
                "h-auto rounded-md px-3 py-1.5 font-headline-sm text-xs uppercase font-bold transition-all flex items-center gap-1.5",
                activeTab === "float"
                  ? "bg-primary text-white shadow-md"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon name="equalizer" className="text-sm" />
              <span>Float Engine</span>
            </Button>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setActiveTab("seed")}
              className={cn(
                "h-auto rounded-md px-3 py-1.5 font-headline-sm text-xs uppercase font-bold transition-all flex items-center gap-1.5",
                activeTab === "seed"
                  ? "bg-status-upcoming text-surface-container-lowest font-bold shadow-md"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon name="gps_fixed" className="text-sm" />
              <span>Seed &amp; Blue Gem Lab</span>
            </Button>
          </div>
        </div>

        {activeTab === "float" ? (
          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
            <div className="rounded-lg bg-surface-card p-space-md border border-border-subtle">
              <label className="font-label-caps text-label-caps text-text-muted uppercase block">
                Average 10-Skin Input Float
                <Input
                  type="number"
                  step="0.0001"
                  value={float}
                  onChange={(event) => setFloat(event.target.value)}
                  className="mt-2 h-auto bg-surface-container-lowest font-data-mono-md text-text-primary text-sm"
                />
              </label>
              <div className="mt-space-md">
                <span className="font-label-caps text-[10px] text-text-muted uppercase block mb-1.5">
                  Popular High-Tier Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "AWP | Dragon Lore", floatVal: "0.0284" },
                    { name: "AK-47 | Fire Serpent", floatVal: "0.0640" },
                    { name: "M4A4 | Howl", floatVal: "0.1200" },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant={null}
                      size={null}
                      onClick={() => setFloat(preset.floatVal)}
                      className="h-auto rounded bg-surface-container-high px-2 py-1 font-label-badge text-[10px] text-text-secondary hover:bg-surface-container-highest transition-colors"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-surface-card p-space-md border border-border-subtle flex flex-col justify-between">
              <span className="font-label-badge text-label-badge text-text-muted uppercase">
                Computed Yield Outcome
              </span>
              <div className="my-auto rounded bg-surface-container-lowest p-space-lg text-center border border-border-dark">
                <span className="font-label-badge text-label-badge text-text-muted uppercase">
                  Exact Deterministic Float
                </span>
                <strong className="block font-data-mono-lg text-3xl text-tertiary my-1 tracking-tight">
                  {computed}
                </strong>
                <span className={cn("font-label-badge text-xs font-bold uppercase", wearGrade.tone)}>
                  {wearGrade.label} · DETERMINISTIC VALVE MATH
                </span>
              </div>
            </div>
          </div>
        ) : (
          <SeedPatternAnalyzer />
        )}
      </div>
    </section>
  );
}
