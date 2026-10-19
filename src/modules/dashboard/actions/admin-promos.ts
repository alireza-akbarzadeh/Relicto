"use server";

import { revalidatePath } from "next/cache";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";
import { addRuntimePromo, updateRuntimePromo } from "../data/get-admin-promos";
import type { DashboardPromoCode } from "../types";

export async function createPromoCodeAction(input: {
  code: string;
  discountBps: number;
  gameId: string;
  maxUses: number;
  expiresAt?: string;
}): Promise<{ success: boolean; promo?: DashboardPromoCode; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const cleanCode = input.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const newPromo: DashboardPromoCode = {
      id: `prm_${cleanCode.toLowerCase()}_${Date.now()}`,
      code: cleanCode,
      discountBps: input.discountBps,
      gameId: input.gameId,
      maxUses: input.maxUses,
      usedCount: 0,
      active: true,
      expiresAt: input.expiresAt || null,
    };

    addRuntimePromo(newPromo);

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "promo_code_create",
      targetType: "promo_code",
      targetId: newPromo.id,
      details: `Created promo code ${cleanCode} (${input.discountBps} bps discount)`,
      severity: "info",
    });

    revalidatePath("/dashboard");

    return { success: true, promo: newPromo };
  } catch (error) {
    console.error("Failed to create promo code:", error);
    return { success: false, error: "Failed to create promo code." };
  }
}

export async function togglePromoCodeAction(
  promoId: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const ok = updateRuntimePromo(promoId, { active });
    if (!ok) {
      return { success: false, error: "Promo code not found." };
    }

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "promo_code_toggle",
      targetType: "promo_code",
      targetId: promoId,
      details: `Set promo code active = ${active}`,
      severity: "info",
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle promo code:", error);
    return { success: false, error: "Failed to toggle promo code." };
  }
}
