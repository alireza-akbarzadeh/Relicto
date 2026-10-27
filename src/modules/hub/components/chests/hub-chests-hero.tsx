"use client";

import Link from "next/link";
import { Sparkles, Flame, Shield, Coins, Gift, ArrowRight } from "lucide-react";

export function HubChestsHero({ onOpenDailyBonus }: { onOpenDailyBonus?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-deep via-surface-card to-surface-container-low p-6 sm:p-8 shadow-2xl">
      {/* Dynamic ambient background glowing orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-400 border border-amber-500/30">
              <Flame className="size-3.5 fill-current" />
              DOTABOOM CASE ARENA
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-bold text-primary border border-primary/20">
              <Shield className="size-3" />
              PROVABLY FAIR SHA-256
            </span>
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
            Unbox Legendary <span className="text-amber-400">Arcanas</span>, Knives & Immortals
          </h2>

          <p className="text-sm text-text-muted leading-relaxed max-w-xl">
            Authentic Valve escalating odds algorithm: every unbox without a bonus skin boosts your odds. Enjoy procedural audio roulette reels and instant 85% coin buyback.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="rounded-xl bg-surface-container-lowest/80 p-2.5 border border-white/5 font-mono">
              <span className="text-[10px] text-text-muted uppercase block">Total Opens</span>
              <span className="text-sm font-bold text-text-primary">54,820+</span>
            </div>
            <div className="rounded-xl bg-surface-container-lowest/80 p-2.5 border border-white/5 font-mono">
              <span className="text-[10px] text-text-muted uppercase block">Top Drop Today</span>
              <span className="text-sm font-bold text-amber-400">$940.00</span>
            </div>
            <div className="rounded-xl bg-surface-container-lowest/80 p-2.5 border border-white/5 font-mono">
              <span className="text-[10px] text-text-muted uppercase block">Relicto Coins</span>
              <span className="text-sm font-bold text-tertiary">1 RC = $1.00</span>
            </div>
            <div className="rounded-xl bg-surface-container-lowest/80 p-2.5 border border-white/5 font-mono">
              <span className="text-[10px] text-text-muted uppercase block">Trade Escrow</span>
              <span className="text-sm font-bold text-status-upcoming">Instant Steam</span>
            </div>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <Link
            href="/chests"
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-on-primary shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="size-4" />
            <span>Enter Full Case Arena</span>
            <ArrowRight className="size-4" />
          </Link>

          {onOpenDailyBonus ? (
            <button
              type="button"
              onClick={onOpenDailyBonus}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <Gift className="size-4" />
              <span>Claim Daily Free Loot</span>
            </button>
          ) : (
            <Link
              href="/chests"
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <Coins className="size-4" />
              <span>Earn Daily Coins</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
