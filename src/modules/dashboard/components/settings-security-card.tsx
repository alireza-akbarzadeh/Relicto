"use client";

import * as React from "react";
import { ShieldAlert, AlertTriangle, Bot, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DashboardSettings } from "../types";

export function SettingsSecurityCard({
  settings,
  onChange,
}: {
  settings: DashboardSettings;
  onChange: (updater: (s: DashboardSettings) => DashboardSettings) => void;
}) {
  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
          <ShieldAlert className="size-4 text-rose-400" />
          Emergency Safety Switches & Guardrails
        </CardTitle>
        <CardDescription className="text-xs text-text-muted mt-0.5">
          Global trading freezes, bot auto-dispatch overrides, and high-value cashout controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Marketplace Maintenance Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border-subtle bg-surface-container">
          <div>
            <span className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
              <AlertTriangle className="size-3.5 text-amber-400" />
              Marketplace Maintenance Mode
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Freezes checkout, tradebot handoffs, and instant cashouts while database migrations run
            </p>
          </div>
          <Button
            type="button"
            size="xs"
            variant={settings.maintenanceMode ? "destructive" : "outline"}
            onClick={() => onChange((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
            className="font-mono text-xs self-start sm:self-auto"
          >
            {settings.maintenanceMode ? "Active: Maintenance ON" : "Normal Operations"}
          </Button>
        </div>

        {/* Steam Daemon Auto-Dispatch */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border-subtle bg-surface-container">
          <div>
            <span className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
              <Bot className="size-3.5 text-primary" />
              Steam Sentinel Bot Auto-Dispatch
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">
              Allow worker daemon to automatically send trade offers without manual admin sign-off
            </p>
          </div>
          <Button
            type="button"
            size="xs"
            variant={settings.steamDaemonAutoDispatch ? "outline" : "destructive"}
            onClick={() => onChange((s) => ({ ...s, steamDaemonAutoDispatch: !s.steamDaemonAutoDispatch }))}
            className="font-mono text-xs self-start sm:self-auto"
          >
            {settings.steamDaemonAutoDispatch ? "Auto-Dispatch: ENABLED" : "Auto-Dispatch: PAUSED"}
          </Button>
        </div>

        {/* High-Value Cashout Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
              <Lock className="size-3 text-amber-400" />
              Manual Cashout Review Threshold ($ USD)
            </label>
            <Input
              type="number"
              min="100"
              value={settings.requireManualApprovalAboveUsd}
              onChange={(e) => onChange((s) => ({ ...s, requireManualApprovalAboveUsd: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">
              Min Trust Score for Instant Crypto Cashout
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={settings.minTrustScoreCashout}
              onChange={(e) => onChange((s) => ({ ...s, minTrustScoreCashout: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
