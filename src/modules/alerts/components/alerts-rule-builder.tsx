"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PriceInput } from "@/components/ui/price-input";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { createAlertRule } from "../actions/rules";
import { Action, Condition, Gate } from "./rule-builder-parts";

export { ALERTS_TONE } from "./rule-builder-parts";

interface PresetItem {
  name: string;
  sub: string;
  benchmarkUsd: number;
  tier: string;
}

const PRESETS: PresetItem[] = [
  { name: "★ Karambit | Case Hardened", sub: "Factory New / Minimal Wear (#387 / #661)", benchmarkUsd: 3150, tier: "★ T1" },
  { name: "★ Butterfly Knife | Doppler", sub: "Factory New / Phase 2 (Pink Galaxy)", benchmarkUsd: 3200, tier: "★ T1" },
  { name: "AWP | Dragon Lore", sub: "Field-Tested / Cobblestone Collection", benchmarkUsd: 6400, tier: "★ S" },
  { name: "AK-47 | Fire Serpent", sub: "Minimal Wear / Bravo Collection", benchmarkUsd: 980, tier: "★ T2" },
  { name: "M4A4 | Howl", sub: "Field-Tested / Contraband Vintage", benchmarkUsd: 4250, tier: "★ S" },
];

const FLOAT_PRESETS = [
  { label: "Any Float", value: null },
  { label: "FN ≤ 0.015", value: 0.015 },
  { label: "MW ≤ 0.070", value: 0.07 },
  { label: "FT ≤ 0.150", value: 0.15 },
] as const;

export function RuleBuilder() {
  const [pending, startTransition] = useTransition();
  const [presetIndex, setPresetIndex] = useState(0);
  const selectedPreset = PRESETS[presetIndex];
  const [targetPrice, setTargetPrice] = useState(() => Math.round(selectedPreset.benchmarkUsd * 0.95));
  const [maxFloat, setMaxFloat] = useState<number | null>(0.015);
  const [autoBuy, setAutoBuy] = useState(true);

  const spreadPct = (((selectedPreset.benchmarkUsd - targetPrice) / selectedPreset.benchmarkUsd) * 100).toFixed(1);

  const handleSelectPreset = (index: number) => {
    setPresetIndex(index);
    setTargetPrice(Math.round(PRESETS[index].benchmarkUsd * 0.95));
  };

  const handleDeploy = () => {
    startTransition(async () => {
      try {
        await createAlertRule({
          name: selectedPreset.name,
          targetUsd: targetPrice,
          maxFloat,
          autoBuy,
        });
        toast.success("Rule Engine Armed & Deployed", {
          description: `Listening for ${selectedPreset.name} under ${formatMoney(targetPrice)}${autoBuy ? " with auto-buy active" : ""}.`,
        });
      } catch {
        toast.error("Rule deployment failed", { description: "Check your connection and try again." });
      }
    });
  };

  return (
    <section id="rule-builder" className="relative overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="pointer-events-none absolute -top-16 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col gap-space-lg">
        <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
          <div className="flex items-center gap-space-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
              <Icon name="play_arrow" className="text-[24px]" />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-text-primary">Algorithmic Trigger Logic Studio</h2>
              <span className="font-label-badge text-label-badge text-text-secondary uppercase">Multi-layer IFTTT protocol // compiled v4.2</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded bg-surface-container-low px-2 py-1 font-label-badge text-[10px] text-tertiary uppercase">Heuristic Evaluation: Active</span>
            <span className="rounded bg-surface-container px-2 py-1 font-label-badge text-[10px] text-status-upcoming uppercase">Instant Escrow Relay</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-space-md rounded-lg bg-surface-container-low p-space-md lg:grid-cols-12">
          <div className="flex items-center gap-space-md lg:col-span-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface-container">
              <div className="flex h-full items-center justify-center text-primary"><Icon name="diamond" className="text-[28px]" /></div>
              <span className="absolute right-0 bottom-0 bg-primary-container px-1 font-label-badge text-[9px] text-on-primary-container">{selectedPreset.tier}</span>
            </div>
            <div>
              <span className="font-label-badge text-[10px] text-text-muted uppercase">Target Essex Inventory Asset</span>
              <h3 className="font-headline-sm text-headline-sm text-text-primary">{selectedPreset.name}</h3>
              <span className="font-data-mono-md text-data-mono-md text-secondary">{selectedPreset.sub}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 lg:col-span-5">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">Select Preset Asset</span>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(i)}
                  className={cn(
                    "rounded px-2 py-1 font-label-caps text-[10px] uppercase transition-all",
                    presetIndex === i ? "bg-primary text-on-primary font-bold shadow-xs" : "bg-surface text-text-secondary hover:text-text-primary",
                  )}
                >
                  {p.name.split("|")[0].replace("★", "").trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="text-right lg:col-span-3">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">Global 24h Benchmark</span>
            <b className="block font-data-mono-lg text-data-mono-lg text-tertiary">{formatMoney(selectedPreset.benchmarkUsd)}</b>
            <span className="font-label-badge text-[10px] text-text-secondary">Steam Liquidity: High</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-sm">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">Execution Target Price</span>
            <PriceInput value={targetPrice} onChange={(val) => setTargetPrice(val)} className="h-10 bg-surface-card px-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-sm">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">Float Ceiling</span>
            <div className="grid grid-cols-2 gap-1 pt-0.5">
              {FLOAT_PRESETS.map((fp) => (
                <button key={fp.label} type="button" onClick={() => setMaxFloat(fp.value)} className={cn("rounded py-1 text-center font-data-mono-md text-[10px]", maxFloat === fp.value ? "bg-secondary text-canvas-base font-bold" : "bg-surface-card text-text-muted hover:text-text-primary")}>
                  {fp.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-1 rounded-xl bg-surface-container-lowest p-space-sm">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">P2P Escrow Auto-Buy</span>
            <button type="button" onClick={() => setAutoBuy(!autoBuy)} className={cn("flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-all", autoBuy ? "bg-status-live/20 text-status-live border border-status-live/40" : "bg-surface-card text-text-muted border border-border-subtle")}>
              <span className="font-headline-sm text-[11px] font-bold">{autoBuy ? "ARMED (AUTO-BUY)" : "NOTIFY ONLY"}</span>
              <Icon name={autoBuy ? "bolt" : "notifications"} className="text-[16px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps text-text-primary uppercase">Execution Condition Matrix</span>
          <Condition letter="A" title="[PRICE INFLICTION METRIC]" detail="Execute on Steam Community Market or P2P Instant Ask" value={`< LESS THAN · ${formatMoney(targetPrice)} USD · ${spreadPct}% SPREAD`} tone="primary" />
          <Gate />
          <Condition letter="B" title="[WEAR / FLOAT & PATTERN SEED]" detail="Deep CS2 Valve protobuf item spec inspection" value={`FLOAT ≤ ${maxFloat ? maxFloat.toFixed(4) : "ANY"} · PROTOBUF INSPECT`} tone="cyan" />
          <Gate />
          <Condition letter="C" title="[CROSS-MARKET NET ARBITRAGE]" detail="Buff163, CSFloat & DMarket spread differential" value="≥ +6.5% NET YIELD · AFTER 2.5% FEE" tone="amber" />
        </div>

        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-3">
          <Action title="Action 1: Auto-Buy" icon="shopping_bag" body={autoBuy ? "Instant P2P Escrow Relay allocates monitored liquidity upon order match." : "Notifications only. Manual authorization required upon alert."} meta={autoBuy ? `CAP CEILING ${formatMoney(targetPrice)}` : "STANDBY (MANUAL)"} tone={autoBuy ? "primary" : "muted"} />
          <Action title="Action 2: Hot Webhook" icon="notifications_active" body="Immediate packet broadcast to Discord #snipes-vip, Telegram Private Bot & SMS failover." meta="DISPATCH PING < 12ms RELAY" tone="cyan" />
          <Action title="Action 3: Instant Re-List" icon="sync_alt" body="Automated marketplace relisting on the Liquidity order book directly after custody." meta="MARKUP MARGIN +8.5% AUTO-BID" tone="amber" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
          <div className="flex flex-wrap gap-4 font-label-badge text-[10px] text-text-secondary">
            <span>☑ Strict Slippage Protection</span>
            <span>☑ Revocation Kill-Switch</span>
            <span className="text-tertiary">Protected by Steam Protobuf Guard</span>
          </div>
          <Button variant={null} size={null} disabled={pending || targetPrice <= 0} onClick={handleDeploy} className="flex h-auto items-center gap-1.5 rounded bg-primary-container px-5 py-2 font-label-caps text-label-caps font-bold text-on-primary-container uppercase shadow-[0_0_16px_rgba(244,63,94,0.35)] transition-all hover:bg-primary disabled:opacity-50">
            <Icon name={pending ? "sync" : "bolt"} className={cn("text-[16px]", pending && "animate-spin")} />
            <span>{pending ? "Deploying Engine..." : "Arm & Deploy Rule Engine"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
