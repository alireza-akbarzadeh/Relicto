"use client";

import * as React from "react";
import { Radio, Globe, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DashboardSettings } from "../types";

export function SettingsBroadcastCard({
  settings,
  onChange,
}: {
  settings: DashboardSettings;
  onChange: (updater: (s: DashboardSettings) => DashboardSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Global Broadcast Announcement */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Radio className="size-4 text-cyan-400" />
            Global System Announcement Banner
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Broadcast emergency alerts, maintenance advisories, or tournament notices to all site visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border-subtle bg-surface-container">
            <div>
              <span className="font-semibold text-xs text-text-primary">Banner Broadcast Active</span>
              <p className="text-[11px] text-text-muted mt-0.5">
                Displays a prominent pinned notification ribbon at the top of every page
              </p>
            </div>
            <Button
              type="button"
              size="xs"
              variant={settings.announcementActive ? "default" : "outline"}
              onClick={() => onChange((s) => ({ ...s, announcementActive: !s.announcementActive }))}
              className="font-mono text-xs self-start sm:self-auto"
            >
              {settings.announcementActive ? "Banner: ACTIVE" : "Banner: INACTIVE"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-text-secondary">Announcement Message</label>
              <Input
                value={settings.activeAnnouncement ?? ""}
                onChange={(e) => onChange((s) => ({ ...s, activeAnnouncement: e.target.value }))}
                placeholder="e.g. Steam Community Market Valve API maintenance scheduled for 14:00 UTC."
                className="h-8 text-xs bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-text-secondary">Severity Tone</label>
              <select
                value={settings.announcementSeverity}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    announcementSeverity: e.target.value as DashboardSettings["announcementSeverity"],
                  }))
                }
                className="w-full h-8 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary"
              >
                <option value="info">Info (Cyan)</option>
                <option value="warning">Warning (Amber)</option>
                <option value="critical">Critical (Red)</option>
                <option value="success">Success (Green)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Identity & Support Channels */}
      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Globe className="size-4 text-primary" />
            Platform Identity & Official Support Channels
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Configure site branding strings and external community gateway URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Platform Name</label>
            <Input
              value={settings.platformName}
              onChange={(e) => onChange((s) => ({ ...s, platformName: e.target.value }))}
              className="h-8 text-xs bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Support Email</label>
            <Input
              value={settings.supportEmail}
              onChange={(e) => onChange((s) => ({ ...s, supportEmail: e.target.value }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-text-secondary">Official Discord Link</label>
            <Input
              value={settings.discordUrl}
              onChange={(e) => onChange((s) => ({ ...s, discordUrl: e.target.value }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
