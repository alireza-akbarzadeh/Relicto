"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { requireUserId } from "@/modules/relicto/data/get-session";

export type SaveTronAddressResult =
  | { success: true; tronAddress: string }
  | { success: false; error: string };

/**
 * Validates a TRON (TRC-20) base58 address.
 * Starts with 'T' and consists of 34 alphanumeric characters excluding 0, O, I, l.
 */
export function isValidTronAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trimmed);
}

export async function saveTronAddress(tronAddress: string): Promise<SaveTronAddressResult> {
  const userId = await requireUserId();
  const trimmed = tronAddress.trim();

  if (trimmed && !isValidTronAddress(trimmed)) {
    return {
      success: false,
      error: "Invalid TRON address. Must be a valid 34-character base58 address starting with 'T'.",
    };
  }

  await db
    .update(profiles)
    .set({ tronAddress: trimmed || null })
    .where(eq(profiles.userId, userId));

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true, tronAddress: trimmed };
}
