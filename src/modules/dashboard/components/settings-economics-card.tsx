"use client";

import * as React from "react";
import { Sliders, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { DashboardSettings } from "../types";

export function SettingsEconomicsCard({
  settings,
  onChange,
}: {
  settings: DashboardSettings;
  onChange: (updater: (s: DashboardSettings) => DashboardSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Ecosystem Fee Structure & Vault Limits */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Sliders className="size-4 text-primary" />
            Ecosystem Fee Structure & Vault Limits
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Set automated platform take rates, VIP liquidity incentives, and treasury cashout ceilings
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Standard Escrow Fee (Bps: 250 = 2.5%)</label>
            <Input
              type="number"
              min="0"
              max="1000"
              value={settings.platformFeeBps}
              onChange={(e) => onChange((s) => ({ ...s, platformFeeBps: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">VIP Tier Escrow Fee (Bps: 150 = 1.5%)</label>
            <Input
              type="number"
              min="0"
              max="1000"
              value={settings.vipFeeBps}
              onChange={(e) => onChange((s) => ({ ...s, vipFeeBps: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Max 24h Cashout Limit ($ USD)</label>
            <Input
              type="number"
              min="100"
              max="100000"
              value={settings.maxWithdrawalUsd}
              onChange={(e) => onChange((s) => ({ ...s, maxWithdrawalUsd: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Min Deposit Amount ($ USD)</label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={settings.minDepositUsd}
              onChange={(e) => onChange((s) => ({ ...s, minDepositUsd: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Tradebot Auto-Cancel (Seconds)</label>
            <Input
              type="number"
              min="300"
              max="3600"
              value={settings.autoCancelTimeoutSeconds}
              onChange={(e) => onChange((s) => ({ ...s, autoCancelTimeoutSeconds: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Trade-Up Forge Fee (Bps: 300 = 3%)</label>
            <Input
              type="number"
              min="0"
              max="1000"
              value={settings.tradeUpFeeBps}
              onChange={(e) => onChange((s) => ({ ...s, tradeUpFeeBps: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
        </CardContent>
      </Card>

      {/* Game Ecosystem Switches */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Gamepad2 className="size-4 text-cyan-400" />
            Game Ecosystem Trading Switches
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Enable or temporarily suspend marketplace trading and inventory synchronization per game
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "enableCs2" as const, label: "Counter-Strike 2", badge: "CS2" },
            { key: "enableDota2" as const, label: "Dota 2", badge: "DOTA" },
            { key: "enableTf2" as const, label: "Team Fortress 2", badge: "TF2" },
            { key: "enableRust" as const, label: "Rust (Beta)", badge: "RUST" },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => onChange((s) => ({ ...s, [item.key]: !s[item.key] }))}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                settings[item.key]
                  ? "bg-primary/10 border-primary/40 text-text-primary"
                  : "bg-surface-container border-border-subtle opacity-60 text-text-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high border border-border-subtle font-bold">
                  {item.badge}
                </span>
                <span
                  className={`size-2 rounded-full ${
                    settings[item.key] ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-neutral-600"
                  }`}
                />
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
              <span className="text-[10px] font-mono">
                {settings[item.key] ? "Trading Active" : "Trading Suspended"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
