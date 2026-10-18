import "server-only";

import { auditService } from "@/server/modules/audit/audit.service";
import type { DashboardAuditLog } from "../types";

export async function getAdminAuditLogs(): Promise<DashboardAuditLog[]> {
  const rows = await auditService.getRecent(200);
  return rows.map((r) => ({
    id: r.id,
    adminId: r.adminId,
    adminName: r.adminName,
    action: r.action,
    targetType: r.targetType,
    targetId: r.targetId,
    details: r.details,
    severity: (r.severity as "info" | "warning" | "critical") ?? "info",
    createdAt: r.createdAt.toISOString(),
  }));
}
