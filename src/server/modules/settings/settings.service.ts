import "server-only";

import * as fs from "node:fs";
import * as path from "node:path";
import type { DashboardSettings } from "@/modules/dashboard/types";

export const DEFAULT_PLATFORM_SETTINGS: DashboardSettings = {
  platformFeeBps: 250,
  vipFeeBps: 150,
  minDepositUsd: 5,
  maxDepositUsd: 25000,
  maxWithdrawalUsd: 10000,
  autoCancelTimeoutSeconds: 900,
  tradeUpFeeBps: 300,
  minTrustScoreCashout: 80,

  enableCs2: true,
  enableDota2: true,
  enableTf2: true,
  enableRust: true,

  maintenanceMode: false,
  maintenanceNotice: null,
  steamDaemonAutoDispatch: true,
  requireManualApprovalAboveUsd: 1000,
  restrictRegistrations: false,

  activeAnnouncement: null,
  announcementActive: false,
  announcementSeverity: "info",
  announcementLink: null,

  platformName: "Relicto",
  supportEmail: "support@relicto.gg",
  discordUrl: "https://discord.gg/relicto",
};

const SETTINGS_FILE_PATH = path.join(process.cwd(), ".settings-runtime.json");

let memoryCache: DashboardSettings | null = null;

export class SettingsService {
  async getSettings(): Promise<DashboardSettings> {
    if (memoryCache) {
      return { ...memoryCache };
    }

    try {
      if (fs.existsSync(SETTINGS_FILE_PATH)) {
        const raw = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw) as Partial<DashboardSettings>;
        memoryCache = Object.assign({}, DEFAULT_PLATFORM_SETTINGS, parsed);
        return { ...memoryCache };
      }
    } catch (err) {
      console.warn("[SettingsService] Failed to read settings file, using defaults:", err);
    }

    memoryCache = { ...DEFAULT_PLATFORM_SETTINGS };
    return { ...memoryCache };
  }

  async updateSettings(updates: Partial<DashboardSettings>): Promise<DashboardSettings> {
    const current = await this.getSettings();
    const merged: DashboardSettings = { ...current };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        (merged as unknown as Record<string, unknown>)[key] = value;
      }
    }

    memoryCache = merged;

    try {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(merged, null, 2), "utf-8");
    } catch (err) {
      console.error("[SettingsService] Failed to write settings file:", err);
    }

    return { ...merged };
  }
}

export const settingsService = new SettingsService();
