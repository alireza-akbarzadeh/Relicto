"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, walletAccounts, ledgerEntries } from "@/lib/db/schema";
import { getSession } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

const ROLE_TONES: Record<string, string> = {
  Admin: "primary",
  Operator: "cyan",
  Trader: "muted",
  "VIP Trader": "amber",
  Moderator: "emerald",
  Suspended: "rose",
};

export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  const session = await getSession();
  if (session?.user?.role?.toLowerCase() !== "admin") {
    return { success: false, error: "Unauthorized. Administrator access required." };
  }

  const roleTone = ROLE_TONES[newRole] ?? "muted";

  try {
    await db
      .update(profiles)
      .set({ role: newRole, roleTone })
      .where(eq(profiles.userId, targetUserId));

    void auditService.record({
      adminId: session.user.id,
      adminName: session.user.name,
      action: "role_update",
      targetType: "user",
      targetId: targetUserId,
      details: `Changed role to ${newRole}`,
      severity: newRole === "Admin" ? "critical" : "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, message: `Role updated to ${newRole}` };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to update role";
    return { success: false, error };
  }
}

export async function toggleUserFreezeAction(targetUserId: string, freeze: boolean) {
  const session = await getSession();
  if (session?.user?.role?.toLowerCase() !== "admin") {
    return { success: false, error: "Unauthorized. Administrator access required." };
  }

  try {
    await db
      .update(walletAccounts)
      .set({ frozenAt: freeze ? new Date() : null })
      .where(eq(walletAccounts.userId, targetUserId));

    void auditService.record({
      adminId: session.user.id,
      adminName: session.user.name,
      action: freeze ? "vault_freeze" : "vault_unfreeze",
      targetType: "user",
      targetId: targetUserId,
      details: freeze ? "Emergency freeze locked user vault" : "Unlocked user vault",
      severity: "warning",
    });

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

export async function adjustUserBalanceAction(
  targetUserId: string,
  amountCentsDelta: number,
  reason: string
) {
  const session = await getSession();
  if (session?.user?.role?.toLowerCase() !== "admin") {
    return { success: false, error: "Unauthorized. Administrator access required." };
  }

  if (amountCentsDelta === 0) {
    return { success: false, error: "Adjustment amount cannot be zero." };
  }

  try {
    const [wallet] = await db
      .select()
      .from(walletAccounts)
      .where(eq(walletAccounts.userId, targetUserId))
      .limit(1);

    if (!wallet) {
      return { success: false, error: "User wallet account not found." };
    }

    const newBalance = wallet.balanceCents + amountCentsDelta;
    if (newBalance < 0) {
      return { success: false, error: "Insufficient balance: adjustment would result in a negative vault." };
    }

    await db
      .update(walletAccounts)
      .set({ balanceCents: newBalance })
      .where(eq(walletAccounts.id, wallet.id));

    await db.insert(ledgerEntries).values({
      walletId: wallet.id,
      kind: amountCentsDelta > 0 ? "deposit" : "withdrawal",
      direction: amountCentsDelta > 0 ? "credit" : "debit",
      status: "settled",
      amountCents: Math.abs(amountCentsDelta),
      balanceAfterCents: newBalance,
      title: "Admin Vault Adjustment",
      detailLabel: reason.trim() ? reason.trim() : "Operational adjustment by administrator",
      venue: "internal",
      nodeLabel: "admin_operator",
      occurredAt: new Date(),
    });

    void auditService.record({
      adminId: session.user.id,
      adminName: session.user.name,
      action: "balance_adjustment",
      targetType: "user",
      targetId: targetUserId,
      details: `Adjusted vault by ${amountCentsDelta > 0 ? "+" : ""}${(amountCentsDelta / 100).toFixed(2)}. Note: ${reason || "None"}`,
      severity: Math.abs(amountCentsDelta) >= 10000 ? "critical" : "warning",
    });

    revalidatePath("/dashboard");
    revalidatePath("/wallet");

    const formatted = `$${(Math.abs(amountCentsDelta) / 100).toFixed(2)}`;
    return {
      success: true,
      message: `Vault adjusted: ${amountCentsDelta > 0 ? `+${formatted} credited` : `-${formatted} debited`}. New balance: $${(newBalance / 100).toFixed(2)}`,
      newBalanceCents: newBalance,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to adjust user balance";
    return { success: false, error };
  }
}
