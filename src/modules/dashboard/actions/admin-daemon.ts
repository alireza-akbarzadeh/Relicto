"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/modules/relicto/data/get-session";
import { steamDaemonService } from "@/server/modules/steam-daemon/steam-daemon.service";
import { auditService } from "@/server/modules/audit/audit.service";

export interface DaemonCycleResult {
  scannedCount: number;
  dispatchedCount: number;
  dispatchedOrders: string[];
  timestamp: string;
}

export async function triggerDaemonCycleAction(): Promise<{
  success: boolean;
  summary?: DaemonCycleResult;
  error?: string;
}> {
  const session = await getSession();
  if (session?.user?.role?.toLowerCase() !== "admin") {
    return { success: false, error: "Unauthorized. Administrator access required." };
  }

  try {
    const summary = await steamDaemonService.runDaemonCycle();

    void auditService.record({
      adminId: session.user.id,
      adminName: session.user.name,
      action: "daemon_trigger",
      targetType: "system",
      targetId: "sentinel_fleet",
      details: `Manual bot dispatch: scanned ${summary.scannedCount}, dispatched ${summary.dispatchedCount} trade offers`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    return { success: true, summary };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to execute daemon dispatch cycle";
    return { success: false, error };
  }
}
