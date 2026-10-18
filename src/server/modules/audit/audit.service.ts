import "server-only";

import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminAuditLogs } from "@/lib/db/schema/audit";

export interface CreateAuditEntry {
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  severity?: "info" | "warning" | "critical";
}

export class AuditService {
  async record(entry: CreateAuditEntry) {
    try {
      await db.insert(adminAuditLogs).values({
        adminId: entry.adminId,
        adminName: entry.adminName,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId ?? null,
        details: entry.details,
        severity: entry.severity ?? "info",
      });
    } catch (err) {
      console.error("[AuditService] Failed to record audit log:", err);
    }
  }

  async getRecent(limit = 100) {
    return db
      .select()
      .from(adminAuditLogs)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limit);
  }
}

export const auditService = new AuditService();
