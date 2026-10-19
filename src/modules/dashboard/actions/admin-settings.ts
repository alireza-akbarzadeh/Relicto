"use server";

import { revalidatePath } from "next/cache";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";
import { settingsService } from "@/server/modules/settings/settings.service";
import type { DashboardSettings } from "../types";

export async function updatePlatformSettingsAction(
  updates: Partial<DashboardSettings>
): Promise<{ success: boolean; settings?: DashboardSettings; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const newSettings = await settingsService.updateSettings(updates);

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "settings_update",
      targetType: "system",
      targetId: "platform_config",
      details: `Updated parameters: ${Object.keys(updates).join(", ")}`,
      severity: updates.maintenanceMode !== undefined ? "critical" : "warning",
    });

    revalidatePath("/dashboard");
    revalidatePath("/marketplace");

    return {
      success: true,
      settings: newSettings,
    };
  } catch (error) {
    console.error("Failed to update platform settings:", error);
    return { success: false, error: "Failed to update platform settings." };
  }
}
