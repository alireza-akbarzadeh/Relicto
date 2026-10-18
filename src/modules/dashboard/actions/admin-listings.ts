"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { getSession } from "@/modules/relicto/data/get-session";

export async function updateListingStatusAction(
  listingId: string,
  newStatus: "active" | "cancelled"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSession();
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db
      .update(listings)
      .set({ status: newStatus })
      .where(eq(listings.id, listingId));

    return {
      success: true,
      message: `Listing ${listingId} is now ${newStatus === "active" ? "active on market" : "delisted by admin"}.`,
    };
  } catch (error) {
    console.error("Failed to update listing status:", error);
    return { success: false, error: "Failed to update listing status." };
  }
}
