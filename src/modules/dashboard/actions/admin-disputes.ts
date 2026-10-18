"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getSession } from "@/modules/relicto/data/get-session";

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

    return {
      success: true,
      message: `Dispute resolved: ${decision === "refund_buyer" ? "Buyer refunded" : "Escrow released to seller"}.`,
    };
  } catch (error) {
    console.error("Failed to resolve dispute:", error);
    return { success: false, error: "Failed to arbitrate dispute." };
  }
}
