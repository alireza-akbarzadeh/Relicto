"use client";

import * as React from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icon/icon-names";
import { Button } from "@/components/ui/button";

export interface CacheTradeExplainerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StepItem {
  step: string;
  title: string;
  time: string;
  icon: IconName;
  badge: string;
  text: string;
}

const STEPS: StepItem[] = [
  {
    step: "01",
    title: "Steam Friend Request",
    time: "Within 15 Mins",
    icon: "person_add",
    badge: "Immediate Action",
    text: "Upon order placement, the verified vendor sends you a Steam friend invite (or provides their Steam profile). Simply accept it to start the friendship clock.",
  },
  {
    step: "02",
    title: "31-Day Vault Escrow",
    time: "31 Days Hold",
    icon: "lock_clock",
    badge: "100% Protected",
    text: "Valve strictly mandates accounts must be friends for 30 consecutive days before in-game gifts can be sent. Your payment remains locked safely in Relicto's Escrow Vault — the vendor receives $0 until delivery.",
  },
  {
    step: "03",
    title: "In-Game Gift & Release",
    time: "Day 31 Delivery",
    icon: "card_giftcard",
    badge: "Guaranteed Refund",
    text: "On Day 31, the vendor gifts the Collector's Cache bundle directly in Dota 2. Inspect the item, confirm receipt in Relicto, and payment releases. If the seller fails or unfriends, you get an instant 100% refund.",
  },
];

export function CacheTradeExplainerModal({ open, onOpenChange }: CacheTradeExplainerModalProps) {
  const handleAskAli = () => {
    onOpenChange(false);
    window.dispatchEvent(
      new CustomEvent("relicto:open-copilot-query", {
        detail: "Ali, how does the 31-day Steam friend hold work for Collector's Cache sets and how is my money protected?",
      })
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="p-5 sm:p-6"
      contentClassName="max-w-2xl bg-[#0e121b] border-pink-500/30"
    >
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pink-500/40 bg-pink-500/10 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <Icon name="card_giftcard" className="text-[24px]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-badge text-[10px] font-bold uppercase tracking-wider text-pink-400">
                Beginner Trader Guide
              </span>
              <span className="rounded bg-pink-500/15 px-1.5 py-0.2 font-data-mono-md text-[9px] font-semibold text-pink-300 border border-pink-500/30">
                Valve Policy Rule
              </span>
            </div>
            <h2 className="font-headline-sm text-lg font-bold text-text-primary">
              Collector&apos;s Cache &amp; 31-Day Friend Escrow
            </h2>
            <p className="font-body-sm text-xs text-text-secondary mt-0.5">
              Confused by the 31-day delay? Here is why it exists and why your funds are 100% secure.
            </p>
          </div>
        </div>

        {/* Empathetic Callout */}
        <div className="rounded-xl border border-pink-500/20 bg-pink-950/20 p-3.5 text-xs text-pink-200 leading-relaxed flex items-start gap-2.5">
          <Icon name="help" className="text-[18px] text-pink-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-pink-100">Why isn&apos;t this instant?</span> Valve designed Dota 2
            Collector&apos;s Cache sets to be permanently unmarketable on the Steam Community Market. They can
            only be transferred once via in-game gifting to friends of 30+ days.
          </div>
        </div>

        {/* 3 Step Flow */}
        <div className="flex flex-col gap-3">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-surface-container-lowest/80 p-3.5 transition-all hover:border-pink-500/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-surface-container font-data-mono-md text-xs font-bold text-pink-400">
                {s.step}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-headline-sm text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <Icon name={s.icon} className="text-[14px] text-pink-400" />
                    {s.title}
                  </span>
                  <span className="font-data-mono-md text-[10px] text-emerald-400 font-medium">
                    {s.badge}
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-text-muted mt-1 leading-normal">
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Guarantees */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-data-mono-md">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-emerald-300">
            <Icon name="verified_user" className="text-[14px] text-emerald-400" />
            <span>100% Vault Escrow Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2 text-cyan-300">
            <Icon name="timelapse" className="text-[14px] text-cyan-400" />
            <span>Automated Day Countdown</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1 border-t border-white/10">
          <Button
            type="button"
            variant="ghost"
            onClick={handleAskAli}
            className="w-full sm:w-auto h-9 px-3.5 text-xs text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 gap-1.5 font-mono"
          >
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Ask Ali (Copilot)</span>
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-9 px-5 text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white rounded-lg"
          >
            Got It, Understood!
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
