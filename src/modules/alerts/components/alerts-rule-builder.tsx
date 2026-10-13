"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { createAlertRule } from "../actions/rules";
import { Action, Condition, Gate } from "./rule-builder-parts";

export { ALERTS_TONE } from "./rule-builder-parts";

export function RuleBuilder() {
  const [pending, startTransition] = useTransition();

  const handleDeploy = () => {
    startTransition(async () => {
      try {
        await createAlertRule({
          name: "★ Karambit | Case Hardened",
          targetUsd: 3050,
          maxFloat: 0.015,
          autoBuy: true,
        });
        toast.success("Rule Engine Armed & Deployed", {
          description: "Algo V4.2 listening on Steam WebSocket feeds with P2P escrow auto-buy armed at $3,050.00.",
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
              <h2 className="font-headline-md text-headline-md text-text-primary">
                Algorithmic Trigger Logic Studio
              </h2>
              <span className="font-label-badge text-label-badge text-text-secondary uppercase">
                Multi-layer IFTTT protocol // compiled v4.2
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded bg-surface-container-low px-2 py-1 font-label-badge text-[10px] text-tertiary uppercase">
              Heuristic Evaluation: Active
            </span>
            <span className="rounded bg-surface-container px-2 py-1 font-label-badge text-[10px] text-status-upcoming uppercase">
              Instant Escrow Relay
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-space-md rounded-lg bg-surface-container-low p-space-md lg:grid-cols-12">
          <div className="flex items-center gap-space-md lg:col-span-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface-container">
              <div className="flex h-full items-center justify-center text-primary">
                <Icon name="diamond" className="text-[28px]" />
              </div>
              <span className="absolute right-0 bottom-0 bg-primary-container px-1 font-label-badge text-[9px] text-on-primary-container">
                ★ T1
              </span>
            </div>
            <div>
              <span className="font-label-badge text-[10px] text-text-muted uppercase">Target Essex Inventory Asset</span>
              <h3 className="font-headline-sm text-headline-sm text-text-primary">★ Karambit | Case Hardened</h3>
              <span className="font-data-mono-md text-data-mono-md text-secondary">
                Factory New / Minimal Wear (#387 / #661)
              </span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">Asset Selection Preset</span>
            <Button
              variant={null}
              size={null}
              className="mt-1 h-auto w-full justify-between rounded bg-surface px-space-md py-space-sm text-left font-body-md text-text-primary"
            >
              ★ Karambit | Case Hardened <Icon name="expand_more" className="text-[16px] text-text-muted" />
            </Button>
          </div>
          <div className="text-right lg:col-span-3">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">Global 24h Benchmark</span>
            <b className="block font-data-mono-lg text-data-mono-lg text-tertiary">$3,150.00</b>
            <span className="font-label-badge text-[10px] text-text-secondary">Steam Liquidity: High</span>
          </div>
        </div>
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps text-text-primary uppercase">Execution Condition Matrix</span>
          <Condition
            letter="A"
            title="[PRICE INFLICTION METRIC]"
            detail="Execute on Steam Community Market or P2P Instant Ask"
            value="< LESS THAN · $3,050.00 USD · -3.17% SPREAD"
            tone="primary"
          />
          <Gate />
          <Condition
            letter="B"
            title="[WEAR / FLOAT & PATTERN SEED]"
            detail="Deep CS2 Valve protobuf item spec inspection"
            value="FLOAT ≤ 0.0150 · PATTERN ['#387', '#412', '#661', '#955']"
            tone="cyan"
          />
          <Gate />
          <Condition
            letter="C"
            title="[CROSS-MARKET NET ARBITRAGE]"
            detail="Buff163, CSFloat & DMarket spread differential"
            value="≥ +6.5% NET YIELD · AFTER 2.5% FEE"
            tone="amber"
          />
        </div>
        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-3">
          <Action
            title="Action 1: Auto-Buy"
            icon="shopping_bag"
            body="Instant P2P Escrow Relay. Allocates monitored vault liquidity without manual two-factor challenge."
            meta="CAP CEILING $3,200.00 USDT"
            tone="primary"
          />
          <Action
            title="Action 2: Hot Webhook"
            icon="notifications_active"
            body="Immediate packet broadcast to Discord #snipes-vip, Telegram Private Bot & SMS priority failover."
            meta="DISPATCH PING < 12ms RELAY"
            tone="cyan"
          />
          <Action
            title="Action 3: Instant Re-List"
            icon="sync_alt"
            body="Automated marketplace relisting on the Liquidity order book directly following inventory custody confirmation."
            meta="MARKUP MARGIN +8.5% AUTO-BID"
            tone="amber"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
          <div className="flex flex-wrap gap-4 font-label-badge text-[10px] text-text-secondary">
            <span>☑ Strict Slippage Protection</span>
            <span>☑ Revocation Kill-Switch</span>
            <span className="text-tertiary">Protected by Steam Protobuf Guard</span>
          </div>
          <Button
            variant={null}
            size={null}
            disabled={pending}
            onClick={handleDeploy}
            className="flex h-auto items-center gap-1.5 rounded bg-primary-container px-5 py-2 font-label-caps text-label-caps font-bold text-on-primary-container uppercase shadow-[0_0_16px_rgba(244,63,94,0.35)] transition-all hover:bg-primary disabled:opacity-50"
          >
            <Icon name={pending ? "sync" : "bolt"} className={cn("text-[16px]", pending && "animate-spin")} />
            <span>{pending ? "Deploying Engine..." : "Arm & Deploy Rule Engine"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
