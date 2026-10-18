import { index, pgTable, text } from "drizzle-orm/pg-core";
import { primaryId, createdAt } from "./_shared";
import { user } from "./auth";

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: primaryId(),
    adminId: text("admin_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    adminName: text("admin_name").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    details: text("details").notNull(),
    severity: text("severity").notNull().default("info"),
    ...createdAt,
  },
  (t) => [
    index("admin_audit_admin_id_idx").on(t.adminId),
    index("admin_audit_action_idx").on(t.action),
    index("admin_audit_created_at_idx").on(t.createdAt),
  ]
);

export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
