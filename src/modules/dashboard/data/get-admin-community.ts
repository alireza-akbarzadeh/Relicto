import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { communityPosts, guilds, profiles } from "@/lib/db/schema";
import type { DashboardCommunityPost } from "../types";

export async function getAdminCommunity(): Promise<DashboardCommunityPost[]> {
  try {
    const rows = await db
      .select({
        post: communityPosts,
        guildName: guilds.name,
        authorHandle: profiles.handle,
      })
      .from(communityPosts)
      .leftJoin(guilds, eq(communityPosts.guildId, guilds.id))
      .leftJoin(profiles, eq(communityPosts.authorId, profiles.userId))
      .orderBy(desc(communityPosts.createdAt))
      .limit(60);

    return rows.map((r) => ({
      id: r.post.id,
      authorId: r.post.authorId,
      authorHandle: r.authorHandle ?? "Anonymous Trader",
      guildName: r.guildName ?? null,
      tag: r.post.tag,
      title: r.post.title,
      body: r.post.body,
      likeCount: r.post.likeCount,
      commentCount: r.post.commentCount,
      createdAt: r.post.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[getAdminCommunity] Failed to load community posts:", err);
    return [];
  }
}
