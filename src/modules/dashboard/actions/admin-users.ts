"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, walletAccounts } from "@/lib/db/schema";
import { getUserId } from "@/modules/relicto/data/get-session";

const ROLE_TONES: Record<string, string> = {
  Admin: "primary",
  Operator: "cyan",
  Trader: "muted",
  "VIP Trader": "amber",
  Moderator: "emerald",
  Suspended: "rose",
};

export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  const currentUserId = await getUserId();
  if (!currentUserId) {
    return { success: false, error: "Unauthorized. Operator access required." };
  }

  const roleTone = ROLE_TONES[newRole] ?? "muted";

  try {
    await db
      .update(profiles)
      .set({ role: newRole, roleTone })
      .where(eq(profiles.userId, targetUserId));

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, message: `Role updated to ${newRole}` };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to update role";
    return { success: false, error };
  }
}

export async function toggleUserFreezeAction(targetUserId: string, freeze: boolean) {
  const currentUserId = await getUserId();
  if (!currentUserId) {
    return { success: false, error: "Unauthorized. Operator access required." };
  }

  try {
    await db
      .update(walletAccounts)
      .set({ frozenAt: freeze ? new Date() : null })
      .where(eq(walletAccounts.userId, targetUserId));

    revalidatePath("/dashboard");
    revalidatePath("/wallet");
    return {
      success: true,
      message: freeze ? "Vault balance successfully frozen" : "Vault balance unlocked",
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to update vault lock";
    return { success: false, error };
  }
}
