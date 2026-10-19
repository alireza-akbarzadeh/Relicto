"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { profiles, user } from "@/lib/db/schema";
import { isValidTradeUrl } from "@/lib/steam/trade-url";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { findOrOpenProfile } from "@/server/modules/profile/profile.repository";

export const updateProfileSchema = z.object({
  handle: z
    .string()
    .trim()
    .min(3, "Handle must be at least 3 characters")
    .max(24, "Handle must be 24 characters or less")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Handle can only contain letters, numbers, underscores, dashes, and dots"),
  realName: z.string().trim().max(60).optional().nullable(),
  alias: z.string().trim().max(40).optional().nullable(),
  role: z.string().trim().max(30).optional().nullable(),
  avatar: z.string().trim().optional().nullable(),
  banner: z.string().trim().optional().nullable(),
  highlightVideo: z.string().trim().optional().nullable(),
  tradeUrl: z.string().trim().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type UpdateProfileResult =
  | { success: true; handle: string }
  | { success: false; error: string };

/**
 * Updates public trader profile details, synchronizing the profile record
 * and Better Auth user entity.
 */
export async function updateProfileDetails(raw: UpdateProfileInput): Promise<UpdateProfileResult> {
  const userId = await requireUserId();
  const parsed = updateProfileSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile parameters",
    };
  }

  const { handle, realName, alias, role, avatar, banner, highlightVideo, tradeUrl } = parsed.data;

  // Validate trade URL format if provided
  if (tradeUrl && tradeUrl.trim().length > 0 && !isValidTradeUrl(tradeUrl.trim())) {
    return {
      success: false,
      error: "Invalid Steam Trade URL. Must contain valid partner and token parameters.",
    };
  }

  // Ensure handle uniqueness across traders
  const [existing] = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(and(eq(profiles.handle, handle), ne(profiles.userId, userId)))
    .limit(1);

  if (existing) {
    return {
      success: false,
      error: `Trader handle @${handle} is already claimed. Choose a different handle.`,
    };
  }

  // Ensure profile record exists
  await findOrOpenProfile(userId);

  // Persist to profiles table
  await db
    .update(profiles)
    .set({
      handle,
      realName: realName || null,
      alias: alias || null,
      role: role || "Trader",
      avatar: avatar || null,
      avatarAlt: avatar ? `${handle} avatar` : null,
      banner: banner || null,
      highlightVideo: highlightVideo || null,
      tradeUrl: tradeUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId));

  // Sync core user identity table
  await db
    .update(user)
    .set({
      name: handle,
      ...(avatar ? { image: avatar } : {}),
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));

  revalidatePath("/", "layout");
  revalidatePath("/profile");
  revalidatePath(`/traders/${handle}`);

  return { success: true, handle };
}
