"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { wikiGuides } from "@/lib/db/schema";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

export async function createWikiGuideAction(input: {
  title: string;
  slug: string;
  category: string;
  summary: string;
  body?: string;
  kind?: "phase" | "seed" | "gem" | "formula";
  readMinutes?: number;
  gameId?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const id = `guide-${cleanSlug}`;

    await db.insert(wikiGuides).values({
      id,
      slug: cleanSlug,
      title: input.title.trim(),
      category: input.category.trim(),
      summary: input.summary.trim(),
      body: input.body?.trim() || null,
      kind: input.kind ?? "formula",
      readMinutes: input.readMinutes ?? 5,
      gameId: input.gameId ?? "cs2",
      presentation: {
        categoryTone: "primary",
        tone: "accent",
        icon: "menu_book",
        meta: `${input.readMinutes ?? 5} min read · Codex Verified`,
      },
    });

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "wiki_guide_create",
      targetType: "wiki_guide",
      targetId: id,
      details: `Created wiki guide "${input.title}" (${input.category})`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/wiki");

    return { success: true, message: `Wiki guide "${input.title}" published.` };
  } catch (error) {
    console.error("Failed to create wiki guide:", error);
    return { success: false, error: "Failed to create wiki guide." };
  }
}

export async function updateWikiGuideAction(
  guideId: string,
  updates: {
    title?: string;
    summary?: string;
    body?: string;
    category?: string;
    readMinutes?: number;
  }
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db
      .update(wikiGuides)
      .set({
        ...(updates.title ? { title: updates.title.trim() } : {}),
        ...(updates.summary ? { summary: updates.summary.trim() } : {}),
        ...(updates.body !== undefined ? { body: updates.body.trim() } : {}),
        ...(updates.category ? { category: updates.category.trim() } : {}),
        ...(updates.readMinutes !== undefined ? { readMinutes: updates.readMinutes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(wikiGuides.id, guideId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "wiki_guide_update",
      targetType: "wiki_guide",
      targetId: guideId,
      details: `Updated wiki guide parameters: ${Object.keys(updates).join(", ")}`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/wiki");

    return { success: true, message: "Wiki guide updated successfully." };
  } catch (error) {
    console.error("Failed to update wiki guide:", error);
    return { success: false, error: "Failed to update wiki guide." };
  }
}

export async function deleteWikiGuideAction(
  guideId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db.delete(wikiGuides).where(eq(wikiGuides.id, guideId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "wiki_guide_delete",
      targetType: "wiki_guide",
      targetId: guideId,
      details: `Deleted wiki guide ${guideId}`,
      severity: "warning",
    });

    revalidatePath("/dashboard");
    revalidatePath("/wiki");

    return { success: true, message: "Wiki guide removed." };
  } catch (error) {
    console.error("Failed to delete wiki guide:", error);
    return { success: false, error: "Failed to delete wiki guide." };
  }
}
