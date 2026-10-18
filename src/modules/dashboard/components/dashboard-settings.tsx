"use client";

import * as React from "react";
import { Sliders, ShieldAlert, Radio, Save, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { DashboardSettings } from "../types";
import { updatePlatformSettingsAction } from "../actions/admin-settings";

export function DashboardSettingsView({ settings: initialSettings }: { settings: DashboardSettings }) {
  const [settings, setSettings] = React.useState<DashboardSettings>(initialSettings);
  const [announcementText, setAnnouncementText] = React.useState(initialSettings.activeAnnouncement ?? "");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updatePlatformSettingsAction({
        ...settings,
        activeAnnouncement: announcementText.trim() ? announcementText.trim() : null,
      });
      if (res.success && res.settings) {
        setSettings(res.settings);
        toast.success("Platform settings successfully updated across all nodes.");
      } else {
        toast.error(res.error ?? "Failed to save settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Fees & Limits */}
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
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-text-secondary">
                Standard Escrow Fee (Basis Points: 250 = 2.5%)
              </label>
              <Input
                type="number"
                min="0"
                max="1000"
                value={settings.platformFeeBps}
                onChange={(e) => setSettings((s) => ({ ...s, platformFeeBps: Number(e.target.value) }))}
                className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-text-secondary">
                VIP Tier Escrow Fee (Basis Points: 150 = 1.5%)
              </label>
              <Input
                type="number"
                min="0"
                max="1000"
                value={settings.vipFeeBps}
                onChange={(e) => setSettings((s) => ({ ...s, vipFeeBps: Number(e.target.value) }))}
                className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-text-secondary">
                Max 24h Vault Cashout Limit ($ USD)
              </label>
              <Input
                type="number"
                min="100"
                max="100000"
                value={settings.maxWithdrawalUsd}
                onChange={(e) => setSettings((s) => ({ ...s, maxWithdrawalUsd: Number(e.target.value) }))}
                className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-text-secondary">
                Tradebot Auto-Cancel Timeout (Seconds)
              </label>
              <Input
                type="number"
                min="300"
                max="3600"
                value={settings.autoCancelTimeoutSeconds}
                onChange={(e) => setSettings((s) => ({ ...s, autoCancelTimeoutSeconds: Number(e.target.value) }))}
                className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Killswitches & Broadcast */}
        <Card className="bg-surface-card border-border-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-400" />
              Emergency Safety Switches & Platform Broadcast
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Instant trading freeze triggers and global client banner alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-container">
              <div>
                <span className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-amber-400" />
                  Marketplace Maintenance Mode
                </span>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Temporarily freezes new buy/sell orders and suspends tradebot handoffs for maintenance
                </p>
              </div>
              <Button
                type="button"
                size="xs"
                variant={settings.maintenanceMode ? "destructive" : "outline"}
                onClick={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                className="font-mono text-xs"
              >
                {settings.maintenanceMode ? "Active: Maintenance ON" : "Normal Operations"}
              </Button>
            </div>

            {/* Announcement Banner */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5">
                <Radio className="size-3 text-cyan-400" />
                Global System Announcement Banner
              </label>
              <div className="flex gap-2">
                <Input
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Steam Community Market undergoing scheduled Valve API maintenance..."
                  className="h-8 text-xs bg-surface-container border-border-subtle flex-1"
                />
                {announcementText && (
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    onClick={() => setAnnouncementText("")}
                    className="text-xs text-text-muted hover:text-text-primary"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" disabled={saving} className="gap-1.5 text-xs font-semibold">
                {saving ? (
                  <CheckCircle2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                Save Platform Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
