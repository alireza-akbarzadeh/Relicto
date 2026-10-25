"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
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

export function RuleBuilder() {
  const t = useTranslations("alerts.ruleBuilder");
  const [pending, startTransition] = useTransition();
  const [presetIndex, setPresetIndex] = useState(0);
  const selectedPreset = PRESETS[presetIndex];
  const [targetPrice, setTargetPrice] = useState(() => Math.round(selectedPreset.benchmarkUsd * 0.95));
  const [maxFloat, setMaxFloat] = useState<number | null>(0.015);
  const [autoBuy, setAutoBuy] = useState(true);

  const floatPresets = [
    { label: t("anyFloat"), value: null },
    { label: t("fn"), value: 0.015 },
    { label: t("mw"), value: 0.07 },
    { label: t("ft"), value: 0.15 },
  ] as const;

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
        toast.success(t("deploySuccess"), {
          description: t("deploySuccessDesc", {
            name: selectedPreset.name,
            target: formatMoney(targetPrice),
            withAutoBuy: autoBuy ? t("withAutoBuy") : "",
          }),
        });
      } catch {
        toast.error(t("deployError"), { description: t("checkConnection") });
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
              <h2 className="font-headline-md text-headline-md text-text-primary">{t("title")}</h2>
              <span className="font-label-badge text-label-badge text-text-secondary uppercase">{t("subtitle")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded bg-surface-container-low px-2 py-1 font-label-badge text-[10px] text-tertiary uppercase">{t("heuristicEval")}</span>
            <span className="rounded bg-surface-container px-2 py-1 font-label-badge text-[10px] text-status-upcoming uppercase">{t("escrowRelay")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-space-md rounded-lg bg-surface-container-low p-space-md lg:grid-cols-12">
          <div className="flex items-center gap-space-md lg:col-span-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface-container">
              <div className="flex h-full items-center justify-center text-primary"><Icon name="diamond" className="text-[28px]" /></div>
              <span className="absolute right-0 bottom-0 bg-primary-container px-1 font-label-badge text-[9px] text-on-primary-container">{selectedPreset.tier}</span>
            </div>
            <div>
              <span className="font-label-badge text-[10px] text-text-muted uppercase">{t("targetAsset")}</span>
              <h3 className="font-headline-sm text-headline-sm text-text-primary">{selectedPreset.name}</h3>
              <span className="font-data-mono-md text-data-mono-md text-secondary">{selectedPreset.sub}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 lg:col-span-5">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">{t("selectPreset")}</span>
            <div className="flex flex-wrap gap-1">
              {PRESETS.map((p, i) => (
                <Button
                  key={p.name}
                  type="button"
                  variant={null}
                  size={null}
                  onClick={() => handleSelectPreset(i)}
                  className={cn(
                    "h-auto rounded px-2 py-1 font-label-caps text-[10px] uppercase transition-all",
                    presetIndex === i ? "bg-primary text-on-primary font-bold shadow-xs" : "bg-surface text-text-secondary hover:text-text-primary",
                  )}
                >
                  {p.name.split("|")[0].replace("★", "").trim()}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-right lg:col-span-3">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">{t("globalBenchmark")}</span>
            <b className="block font-data-mono-lg text-data-mono-lg text-tertiary">{formatMoney(selectedPreset.benchmarkUsd)}</b>
            <span className="font-label-badge text-[10px] text-text-secondary">{t("steamLiquidity")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-sm">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">{t("targetPrice")}</span>
            <PriceInput value={targetPrice} onChange={(val) => setTargetPrice(val)} className="h-10 bg-surface-card px-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-sm">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">{t("floatCeiling")}</span>
            <div className="grid grid-cols-2 gap-1 pt-0.5">
              {floatPresets.map((fp) => (
                <Button
                  key={fp.label}
                  type="button"
                  variant={null}
                  size={null}
                  onClick={() => setMaxFloat(fp.value)}
                  className={cn("h-auto rounded py-1 text-center font-data-mono-md text-[10px]", maxFloat === fp.value ? "bg-secondary text-canvas-base font-bold" : "bg-surface-card text-text-muted hover:text-text-primary")}
                >
                  {fp.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-1 rounded-xl bg-surface-container-lowest p-space-sm">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">{t("autoBuy")}</span>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setAutoBuy(!autoBuy)}
              className={cn("flex h-auto items-center justify-between rounded-lg px-2.5 py-1.5 transition-all", autoBuy ? "bg-status-live/20 text-status-live border border-status-live/40" : "bg-surface-card text-text-muted border border-border-subtle")}
            >
              <span className="font-headline-sm text-[11px] font-bold">{autoBuy ? t("armedAutoBuy") : t("notifyOnly")}</span>
              <Icon name={autoBuy ? "bolt" : "notifications"} className="text-[16px]" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps text-text-primary uppercase">{t("conditionMatrix")}</span>
          <Condition letter="A" title={t("condATitle")} detail={t("condADetail")} value={t("condALessThan", { price: formatMoney(targetPrice), spread: spreadPct })} tone="primary" />
          <Gate />
          <Condition letter="B" title={t("condBTitle")} detail={t("condBDetail")} value={t("condBValue", { float: maxFloat ? maxFloat.toFixed(4) : t("any") })} tone="cyan" />
          <Gate />
          <Condition letter="C" title={t("condCTitle")} detail={t("condCDetail")} value={t("condCValue")} tone="amber" />
        </div>

        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-3">
          <Action title={t("action1Title")} icon="shopping_bag" body={autoBuy ? t("action1BodyActive") : t("action1BodyManual")} meta={autoBuy ? t("action1MetaActive", { price: formatMoney(targetPrice) }) : t("action1MetaManual")} tone={autoBuy ? "primary" : "muted"} />
          <Action title={t("action2Title")} icon="notifications_active" body={t("action2Body")} meta={t("action2Meta")} tone="cyan" />
          <Action title={t("action3Title")} icon="sync_alt" body={t("action3Body")} meta={t("action3Meta")} tone="amber" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
          <div className="flex flex-wrap gap-4 font-label-badge text-[10px] text-text-secondary">
            <span>{t("slippageProtection")}</span>
            <span>{t("killSwitch")}</span>
            <span className="text-tertiary">{t("protobufGuard")}</span>
          </div>
          <Button variant={null} size={null} disabled={pending || targetPrice <= 0} onClick={handleDeploy} className="flex h-auto items-center gap-1.5 rounded bg-primary-container px-5 py-2 font-label-caps text-label-caps font-bold text-on-primary-container uppercase shadow-[0_0_16px_rgba(244,63,94,0.35)] transition-all hover:bg-primary disabled:opacity-50">
            <Icon name={pending ? "sync" : "bolt"} className={cn("text-[16px]", pending && "animate-spin")} />
            <span>{pending ? t("deploying") : t("deployButton")}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
