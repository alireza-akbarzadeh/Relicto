"use client";

import * as React from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardSettings } from "../types";
import { updatePlatformSettingsAction } from "../actions/admin-settings";
import { SettingsEconomicsCard } from "./settings-economics-card";
import { SettingsSecurityCard } from "./settings-security-card";
import { SettingsBroadcastCard } from "./settings-broadcast-card";

export function DashboardSettingsView({ settings: initialSettings }: { settings: DashboardSettings }) {
  const [settings, setSettings] = React.useState<DashboardSettings>(initialSettings);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updatePlatformSettingsAction(settings);
      if (res.success && res.settings) {
        setSettings(res.settings);
        toast.success("Platform settings successfully synchronized across all nodes.");
      } else {
        toast.error(res.error ?? "Failed to save settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Sticky Save Bar */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-card sticky top-14 z-10 backdrop-blur-md">
        <div>
          <span className="font-semibold text-xs text-text-primary">Master Configuration Panel</span>
          <p className="text-[11px] text-text-muted mt-0.5">
            Synchronizes fee schedules, security switches, and ecosystem toggles to PostgreSQL
          </p>
        </div>
        <Button type="submit" size="sm" disabled={saving} className="gap-1.5 font-semibold text-xs shadow-sm">
          <Save className="size-3.5" />
          {saving ? "Saving Changes..." : "Save All Platform Settings"}
        </Button>
      </div>

      <SettingsEconomicsCard settings={settings} onChange={setSettings} />
      <SettingsSecurityCard settings={settings} onChange={setSettings} />
      <SettingsBroadcastCard settings={settings} onChange={setSettings} />
    </form>
  );
}
