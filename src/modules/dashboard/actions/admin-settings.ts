"use server";

import { getSession } from "@/modules/relicto/data/get-session";
import type { DashboardSettings } from "../types";

let currentSettings: DashboardSettings = {
  platformFeeBps: 250,
  vipFeeBps: 150,
  maxWithdrawalUsd: 10000,
  autoCancelTimeoutSeconds: 900,
  maintenanceMode: false,
  activeAnnouncement: null,
};

export async function updatePlatformSettingsAction(
  updates: Partial<DashboardSettings>
): Promise<{ success: boolean; settings?: DashboardSettings; error?: string }> {
  try {
    const session = await getSession();
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    currentSettings = { ...currentSettings, ...updates };

    return {
      success: true,
      settings: currentSettings,
    };
  } catch (error) {
    console.error("Failed to update platform settings:", error);
    return { success: false, error: "Failed to update platform settings." };
  }
}
