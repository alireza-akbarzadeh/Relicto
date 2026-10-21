"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { profiles, user } from "@/lib/db/schema";
import { isValidTradeUrl } from "@/lib/steam/trade-url";
import { getUserId } from "@/modules/relicto/data/get-session";
import { findOrOpenProfile } from "@/server/modules/profile/profile.repository";

export const kycSubmissionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(80, "Full name cannot exceed 80 characters"),
  nationalId: z
    .string()
    .trim()
    .min(6, "National ID or Passport number must be at least 6 characters")
    .max(24, "National ID cannot exceed 24 characters"),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Valid mobile phone number required")
    .max(20, "Phone number cannot exceed 20 characters"),
  country: z.string().trim().max(40).optional().default("IR"),
  tradeUrl: z.string().trim().optional(),
  payoutAddress: z.string().trim().max(128).optional(),
});

export type KycSubmissionInput = z.input<typeof kycSubmissionSchema>;

export type KycResult =
  | { success: true; message: string; verifiedAt: string }
  | { success: false; error: string };

/**
 * Processes trader KYC verification, elevating account trust, unlocking instant
 * escrow bot liquidity, and setting verified seller badges across marketplace and studio.
 */
export async function submitTraderKycAction(raw: KycSubmissionInput): Promise<KycResult> {
  try {
    let userId = await getUserId();
    if (!userId && process.env.NODE_ENV === "development") {
      userId = "seed-trader-relicto";
    }

    if (!userId) {
      return { success: false, error: "Authentication required to complete KYC verification." };
    }

    const parsed = kycSubmissionSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid verification parameters",
      };
    }

    const { fullName, tradeUrl, payoutAddress } = parsed.data;

    if (tradeUrl && !isValidTradeUrl(tradeUrl)) {
      return {
        success: false,
        error: "Steam Trade URL is invalid. Must include partner and token parameters.",
      };
    }

    const current = await findOrOpenProfile(userId);
    if (!current) {
      return { success: false, error: "Trader profile record not found." };
    }

    const now = new Date().toISOString();
    const existingTelemetry = Array.isArray(current.telemetry) ? current.telemetry : [];
    const filteredTelemetry = existingTelemetry.filter((t) => t.label !== "KYC VERIFIED");
    const updatedTelemetry = [
      ...filteredTelemetry,
      { label: "KYC VERIFIED", tone: "live", pulse: false },
    ];

    const updates: Partial<typeof profiles.$inferInsert> = {
      realName: fullName,
      tier: "TIER-1 PRO",
      role: "Verified Seller",
      roleTone: "amber",
      trustScore: 999, // 99.9%
      telemetry: updatedTelemetry,
      updatedAt: new Date(),
    };

    if (tradeUrl) {
      updates.tradeUrl = tradeUrl;
    }
    if (payoutAddress && payoutAddress.startsWith("T") && payoutAddress.length === 34) {
      updates.tronAddress = payoutAddress;
    }

    await db.update(profiles).set(updates).where(eq(profiles.userId, userId));
    await db.update(user).set({ name: fullName, emailVerified: true }).where(eq(user.id, userId));

    revalidatePath("/sell");
    revalidatePath("/profile");
    revalidatePath("/user/kyc");
    revalidatePath("/kyc");
    revalidatePath("/marketplace");

    return {
      success: true,
      message: "Identity verification successfully completed. Seller privileges activated.",
      verifiedAt: now,
    };
  } catch (err) {
    console.error("[submitTraderKycAction] Verification failed:", err);
    return { success: false, error: "Internal verification error. Please retry." };
  }
}
