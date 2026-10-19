"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

export interface CreateCatalogItemInput {
  name: string;
  slug: string;
  gameId: string;
  rarity?: "arcana" | "exalted" | "immortal" | "ancient" | "mythical" | "rare" | "persona" | "helm" | "cache" | "covert" | "melee" | "gloves";
  slot?: string;
  collection?: string;
  imageUrl?: string;
  description?: string;
  minFloat?: number;
  maxFloat?: number;
}

export async function createCatalogItemAction(
  input: CreateCatalogItemInput
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const id = `item-${cleanSlug}`;

    await db.insert(items).values({
      id,
      slug: cleanSlug,
      name: input.name.trim(),
      gameId: input.gameId,
      rarity: input.rarity ?? "covert",
      slot: input.slot?.trim() || "Weapon",
      collection: input.collection?.trim() || null,
      imageUrl: input.imageUrl?.trim() || "/images/placeholders/item-default.png",
      description: input.description?.trim() || null,
      minFloat: input.minFloat ?? 0,
      maxFloat: input.maxFloat ?? 1,
    });

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "catalog_item_create",
      targetType: "catalog_item",
      targetId: id,
      details: `Created catalog item "${input.name}" (${input.gameId})`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/marketplace");

    return { success: true, message: `Created catalog item "${input.name}".` };
  } catch (error) {
    console.error("Failed to create catalog item:", error);
    return { success: false, error: "Failed to create catalog item." };
  }
}

export async function updateCatalogItemAction(
  itemId: string,
  updates: Partial<CreateCatalogItemInput>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db
      .update(items)
      .set({
        ...(updates.name ? { name: updates.name.trim() } : {}),
        ...(updates.slot !== undefined ? { slot: updates.slot.trim() } : {}),
        ...(updates.collection !== undefined ? { collection: updates.collection.trim() } : {}),
        ...(updates.imageUrl !== undefined ? { imageUrl: updates.imageUrl.trim() } : {}),
        ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
        ...(updates.minFloat !== undefined ? { minFloat: updates.minFloat } : {}),
        ...(updates.maxFloat !== undefined ? { maxFloat: updates.maxFloat } : {}),
        updatedAt: new Date(),
      })
      .where(eq(items.id, itemId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "catalog_item_update",
      targetType: "catalog_item",
      targetId: itemId,
      details: `Updated catalog item: ${Object.keys(updates).join(", ")}`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/marketplace");

    return { success: true, message: "Catalog item updated successfully." };
  } catch (error) {
    console.error("Failed to update catalog item:", error);
    return { success: false, error: "Failed to update catalog item." };
  }
}
