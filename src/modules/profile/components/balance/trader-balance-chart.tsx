"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { UserBalanceSummary } from "../../types";
import { BalanceDonutChart } from "./balance-donut-chart";
import { BalanceTrendChart } from "./balance-trend-chart";
import { formatByCurrency, formatDelta, type CurrencyMode } from "./currency-utils";

type ChartView = "donut" | "trend";

export function TraderBalanceChart({ balance }: { balance?: UserBalanceSummary }) {
  const [currency, setCurrency] = useState<CurrencyMode>("usd");
  const [view, setView] = useState<ChartView>("donut");

  if (!balance) return null;

  const totalFormatted = formatByCurrency(balance.totalUsd, currency);
  const changeFormatted = formatByCurrency(balance.change24hUsd, currency);
  const delta = formatDelta(balance.change24hPct);

  return (
    <section className="w-full px-gutter-desktop py-space-sm">
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-surface-card/90 p-space-md shadow-xl backdrop-blur-xl md:p-space-lg">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Top Header Bar */}
        <div className="relative flex flex-col justify-between gap-space-md border-b border-white/6 pb-space-md sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Icon name="account_balance_wallet" className="text-[18px]" />
              </span>
              <span className="font-label-caps text-label-caps font-bold tracking-wider text-text-primary uppercase">
                Trader Net Balance &amp; Treasury Portfolio
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-2xl font-bold tracking-tight text-white md:text-3xl">
                {totalFormatted.primary}
              </span>
              <span className="font-headline-sm text-sm font-semibold text-text-muted">
                {totalFormatted.secondary}
              </span>
              <span
                className={`ml-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-data-mono-md text-xs font-bold ${
                  delta.positive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                }`}
              >
                <Icon name={delta.positive ? "trending_up" : "trending_down"} className="text-[13px]" />
                {delta.text} ({changeFormatted.primary} 24h)
              </span>
            </div>
          </div>

          {/* Currency Switcher & View Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Currency Switcher Pills */}
            <div className="flex items-center rounded-lg bg-surface-container-lowest p-1 shadow-inner">
              {(
                [
                  { id: "usd", label: "$ USD" },
                  { id: "toman", label: "تومان Toman" },
                  { id: "coin", label: "🪙 USDT / Coin" },
                ] as const
              ).map((curr) => (
                <Button
                  key={curr.id}
                  variant={null}
                  size={null}
                  onClick={() => setCurrency(curr.id)}
                  className={`h-auto rounded-md px-2.5 py-1 font-headline-sm text-xs font-semibold transition-all ${
                    currency === curr.id
                      ? "bg-primary text-on-primary font-bold shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {curr.label}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-lg bg-surface-container-lowest p-1 shadow-inner">
              <Button
                variant={null}
                size={null}
                onClick={() => setView("donut")}
                title="Asset Allocation Ring"
                className={`flex h-auto items-center gap-1 rounded-md px-2.5 py-1 font-headline-sm text-xs font-semibold ${
                  view === "donut" ? "bg-surface-container-high text-text-primary" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon name="analytics" className="text-[14px]" />
                <span className="hidden sm:inline">Breakdown</span>
              </Button>
              <Button
                variant={null}
                size={null}
                onClick={() => setView("trend")}
                title="7-Day Growth Trend"
                className={`flex h-auto items-center gap-1 rounded-md px-2.5 py-1 font-headline-sm text-xs font-semibold ${
                  view === "trend" ? "bg-surface-container-high text-text-primary" : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon name="monitoring" className="text-[14px]" />
                <span className="hidden sm:inline">7D Growth</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Chart Body */}
        <div className="relative pt-space-md">
          {view === "donut" ? (
            <BalanceDonutChart
              segments={balance.segments}
              totalUsd={balance.totalUsd}
              currency={currency}
            />
          ) : (
            <BalanceTrendChart trend={balance.trend} currency={currency} />
          )}
        </div>

        {/* Bottom Fast Action Footer */}
        <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-sm border-t border-white/6 pt-space-sm">
          <div className="flex items-center gap-2 font-data-mono-md text-[11px] text-text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Exchange Reference: 1 USD = 95,000 Tomans · 1.00 USDT · 8.33 TRX</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/wallet"
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-headline-sm text-xs font-bold text-on-primary uppercase shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:opacity-90"
            >
              <Icon name="add" className="text-[14px]" />
              <span>Deposit</span>
            </Link>
            <Link
              href="/wallet"
              className="flex items-center gap-1 rounded-lg bg-surface-container-high px-3 py-1.5 font-headline-sm text-xs font-semibold text-text-primary uppercase hover:bg-surface-bright"
            >
              <Icon name="toll" className="text-[14px]" />
              <span>Cashout</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
