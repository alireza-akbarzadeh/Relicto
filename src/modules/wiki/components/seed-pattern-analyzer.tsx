"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { lookupSeedPattern, type SeedPattern } from "../data/seed-patterns";

const WEAPONS: Array<SeedPattern["weapon"]> = [
  "AK-47",
  "Karambit",
  "Butterfly Knife",
  "M9 Bayonet",
];

const PRESET_SEEDS = [
  { seed: 661, label: "#661 The Scar", weapon: "AK-47" as const },
  { seed: 387, label: "#387 God Blue", weapon: "Karambit" as const },
  { seed: 321, label: "#321 True Blue", weapon: "AK-47" as const },
  { seed: 151, label: "#151 Blue Butt", weapon: "AK-47" as const },
  { seed: 219, label: "#219 Pure Gold", weapon: "AK-47" as const },
];

export function SeedPatternAnalyzer() {
  const [weapon, setWeapon] = useState<SeedPattern["weapon"]>("AK-47");
  const [seedInput, setSeedInput] = useState<string>("661");

  const currentPattern = lookupSeedPattern(parseInt(seedInput, 10) || 1, weapon);

  const handleSelectPreset = (seed: number, w: SeedPattern["weapon"]) => {
    setWeapon(w);
    setSeedInput(String(seed));
  };

  return (
    <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
      {/* Input Panel */}
      <div className="rounded-lg bg-surface-card p-space-md border border-border-subtle">
        <div className="flex items-center justify-between mb-3">
          <span className="font-label-caps text-xs text-text-muted uppercase">Select Weapon Matrix</span>
          <div className="flex flex-wrap gap-1">
            {WEAPONS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeapon(w)}
                className={cn(
                  "rounded px-2 py-0.5 font-label-badge text-[11px] transition-colors",
                  weapon === w
                    ? "bg-primary text-white font-bold"
                    : "bg-surface-container-high text-text-muted hover:text-text-primary"
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <label className="font-label-caps text-xs text-text-muted uppercase block">
          Enter Pattern Seed Index (1 – 1000)
          <div className="relative mt-2">
            <Input
              type="number"
              min={1}
              max={1000}
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              className="h-10 bg-surface-container-lowest font-data-mono-md text-text-primary pl-3 pr-10 text-sm"
              placeholder="e.g. 661"
            />
            <span className="absolute right-3 top-2.5 font-data-mono-md text-xs text-text-muted">#SEED</span>
          </div>
        </label>

        <div className="mt-4">
          <span className="font-label-caps text-[10px] text-text-muted uppercase block mb-1.5">
            Legendary Canonical Seeds
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_SEEDS.map((p) => (
              <Button
                key={p.seed}
                variant={null}
                size={null}
                onClick={() => handleSelectPreset(p.seed, p.weapon)}
                className={cn(
                  "h-auto rounded border px-2 py-1 font-label-badge text-[11px] transition-all",
                  seedInput === String(p.seed)
                    ? "border-status-upcoming bg-status-upcoming/20 text-status-upcoming font-bold"
                    : "border-border-dark bg-surface-container-high text-text-secondary hover:bg-surface-container-highest"
                )}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome Analysis Card */}
      <div className="rounded-lg bg-surface-card p-space-md border border-border-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-label-badge text-xs text-text-muted uppercase">Surface Analysis Result</span>
            <span
              className={cn(
                "rounded px-2 py-0.5 font-label-caps text-xs uppercase font-bold",
                currentPattern.tier.includes("God")
                  ? "bg-status-upcoming/20 text-status-upcoming border border-status-upcoming/40"
                  : currentPattern.tier.includes("Tier 1")
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : currentPattern.tier.includes("Gold")
                      ? "bg-tertiary/20 text-tertiary border border-tertiary/40"
                      : "bg-surface-container-high text-text-muted"
              )}
            >
              {currentPattern.tier}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="font-headline-lg text-2xl font-bold text-text-primary">
              {currentPattern.weapon} · Seed #{currentPattern.seed}
            </h3>
            {currentPattern.alias && (
              <span className="font-data-mono-md text-xs text-tertiary font-bold">
                ({currentPattern.alias})
              </span>
            )}
          </div>

          {/* Visual Percentage Bar */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex justify-between font-data-mono-md text-xs">
              <span className="text-status-upcoming font-bold">Blue Coverage: {currentPattern.bluePercent}%</span>
              <span className="text-tertiary font-bold">Gold / Dull: {currentPattern.goldPercent}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden flex">
              <div
                style={{ width: `${currentPattern.bluePercent}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              />
              <div
                style={{ width: `${currentPattern.goldPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-300"
              />
            </div>
          </div>

          <p className="mt-3 font-body-sm text-xs text-text-secondary leading-relaxed">
            {currentPattern.description}
          </p>
        </div>

        {/* Valuation Overpay Multiplier */}
        <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between bg-surface-container-lowest/50 p-2.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Icon name="payments" className="text-tertiary text-base" />
            <span className="font-label-caps text-xs text-text-muted uppercase">Market Overpay Estimate</span>
          </div>
          <span className="font-data-mono-md text-sm font-bold text-tertiary">
            {currentPattern.overpayMultiplier}
          </span>
        </div>
      </div>
    </div>
  );
}
