"use client";

import * as React from "react";
import { Sparkles, TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EscalatingOddsState } from "../types";

export function EscalatingOddsTable({
  streak,
  escalatingOdds,
}: {
  streak: number;
  escalatingOdds: EscalatingOddsState[];
}) {
  if (!escalatingOdds || escalatingOdds.length === 0) return null;

  return (
    <Card className="border-border-subtle bg-surface-card/90 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400" />
            Authentic Dota 2 Escalating Odds
          </CardTitle>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            Consecutive Open Streak: #{streak}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 rounded-lg bg-surface-container p-2.5 text-xs text-text-muted">
          <Info className="size-4 shrink-0 text-primary mt-0.5" />
          <span>
            Valve mechanism: Every chest opened that does not yield a rare bonus item permanently increases your drop probability on subsequent opens until hit.
          </span>
        </div>

        <div className="space-y-2">
          {escalatingOdds.map((item) => {
            const pct = item.currentOddsPct;
            const progress = Math.min(100, Math.max(5, (pct / 70) * 100));

            return (
              <div
                key={item.label}
                className="rounded-xl border border-border-subtle bg-surface-container p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-primary">{item.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-text-muted text-[11px]">
                      Base: {item.baseOddsPct}%
                    </span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      Current: {item.currentOddsPct}%
                    </span>
                  </div>
                </div>

                {/* Visual Odds Boost Bar */}
                <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-tertiary transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
