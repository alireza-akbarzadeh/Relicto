"use client";

import * as React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { IncomeChartPoint, GameDistribution } from "../types";

interface DashboardChartsProps {
  chartData: IncomeChartPoint[];
  gameBreakdown: GameDistribution[];
}

export function DashboardCharts({ chartData, gameBreakdown }: DashboardChartsProps) {
  const totalVolume = gameBreakdown.reduce((sum, g) => sum + g.volumeUsd, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Income & Volume Telemetry Area Chart */}
      <Card className="lg:col-span-2 bg-surface-card border-border-subtle">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary">
              Trading Volume & Net Revenue
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Trailing performance across settled trades and platform escrow fees
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="size-2 rounded-full bg-primary" /> Volume (USD)
            </span>
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="size-2 rounded-full bg-cyan-400" /> Income (USD)
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-container)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary-container)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg bg-surface-container border border-border-subtle p-2.5 shadow-lg text-xs font-mono space-y-1">
                          <p className="font-bold text-text-primary mb-1">{label}</p>
                          <p className="text-primary">
                            Volume: ${payload[0]?.value?.toLocaleString()} USD
                          </p>
                          <p className="text-cyan-400">
                            Income: ${payload[1]?.value?.toLocaleString()} USD
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volumeUsd"
                  stroke="var(--color-primary-container)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#volumeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="incomeUsd"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Game Ecosystem Distribution */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary">
            Ecosystem Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Share of liquidity and trades by game title
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameBreakdown.map((item) => {
            const pct = Math.round((item.volumeUsd / totalVolume) * 100);
            return (
              <div key={item.game} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text-primary flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-mono text-text-muted">
                    ${item.volumeUsd.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted font-mono">
                  <span>{item.count} assets traded</span>
                  <span>Avg ${(item.volumeUsd / Math.max(1, item.count)).toFixed(0)} / trade</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
