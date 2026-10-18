"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

export async function updateListingStatusAction(
  listingId: string,
  newStatus: "active" | "cancelled"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db
      .update(listings)
      .set({ status: newStatus })
      .where(eq(listings.id, listingId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: newStatus === "cancelled" ? "listing_delist" : "listing_relist",
      targetType: "listing",
      targetId: listingId,
      details: `Listing status set to ${newStatus}`,
      severity: newStatus === "cancelled" ? "warning" : "info",
    });

    return {
      success: true,
      message: `Listing ${listingId} is now ${newStatus === "active" ? "active on market" : "delisted by admin"}.`,
    };
  } catch (error) {
    console.error("Failed to update listing status:", error);
    return { success: false, error: "Failed to update listing status." };
  }
}
