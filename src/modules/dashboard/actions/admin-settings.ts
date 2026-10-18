"use server";

import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";
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
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    currentSettings = { ...currentSettings, ...updates };

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "settings_update",
      targetType: "system",
      targetId: "platform_config",
      details: `Updated parameters: ${Object.keys(updates).join(", ")}`,
      severity: updates.maintenanceMode !== undefined ? "critical" : "warning",
    });

    return {
      success: true,
      settings: currentSettings,
    };
  } catch (error) {
    console.error("Failed to update platform settings:", error);
    return { success: false, error: "Failed to update platform settings." };
  }
}
