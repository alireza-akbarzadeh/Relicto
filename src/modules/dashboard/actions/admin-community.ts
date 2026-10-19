"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { communityPosts } from "@/lib/db/schema";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

export async function deleteCommunityPostAction(
  postId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db.delete(communityPosts).where(eq(communityPosts.id, postId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "community_post_moderation_delete",
      targetType: "community_post",
      targetId: postId,
      details: `Moderator deleted community post ${postId}`,
      severity: "warning",
    });

    revalidatePath("/dashboard");
    revalidatePath("/community");

    return { success: true, message: "Community post removed by moderator." };
  } catch (error) {
    console.error("Failed to delete community post:", error);
    return { success: false, error: "Failed to delete community post." };
  }
}
