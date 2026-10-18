"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getSession } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

export async function resolveDisputeAction(
  orderIdOrCode: string,
  decision: "refund_buyer" | "release_seller"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSession();
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const newState = decision === "refund_buyer" ? "cancelled" : "completed";
    const note = `Arbitration resolved by Admin: ${decision === "refund_buyer" ? "Refunded buyer vault" : "Released escrow to seller"}`;

    await db
      .update(orders)
      .set({
        state: newState,
        settlementNote: note,
        completedAt: new Date(),
      })
      .where(eq(orders.id, orderIdOrCode));

    void auditService.record({
      adminId: session.user.id,
      adminName: session.user.name,
      action: "dispute_resolution",
      targetType: "order",
      targetId: orderIdOrCode,
      details: `Dispute arbitrated: ${decision === "refund_buyer" ? "Buyer refunded" : "Released to seller"}`,
      severity: "warning",
    });

    return {
      success: true,
      message: `Dispute resolved: ${decision === "refund_buyer" ? "Buyer refunded" : "Escrow released to seller"}.`,
    };
  } catch (error) {
    console.error("Failed to resolve dispute:", error);
    return { success: false, error: "Failed to arbitrate dispute." };
  }
}
