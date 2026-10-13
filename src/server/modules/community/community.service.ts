import "server-only";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { communityComments, communityPostLikes, communityPosts, guilds, profiles, user } from "@/lib/db/schema";
import type { CommunityComment, CommunityData, CommunityPost, CommunityTone } from "@/modules/community/types";
import { ago } from "@/server/modules/shared/ago";
import type { broadcastPostInput } from "./community.schema";
import type { z } from "zod";

type PostRow = {
  post: typeof communityPosts.$inferSelect;
  handle: string | null;
  role: string | null;
  roleTone: string | null;
  fallbackName: string;
};

function initials(handle: string) {
  const parts = handle.replace(/^@/, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[_\-.\s]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts.slice(0, 2).map((p) => p[0]) : [parts[0]?.[0], parts[0]?.[1]];
  return letters.filter(Boolean).join("").toUpperCase();
}

function toPost(row: PostRow, now: Date, liked = false): CommunityPost {
  const handle = row.handle ? `@${row.handle}` : `@${row.fallbackName}`;
  const { post } = row;
  return {
    id: post.id,
    initials: initials(handle),
    handle,
    role: row.role ?? "Trader",
    roleTone: (row.roleTone ?? "muted") as CommunityTone,
    age: ago(post.createdAt, now),
    tag: post.tag ?? "",
    tagTone: post.tagTone as CommunityTone,
    title: post.title,
    body: post.body,
    ...(post.image ? { image: post.image } : {}),
    ...(post.metricLabel
      ? { metric: { label: post.metricLabel, value: post.metricValue ?? "", delta: post.metricDelta ?? "" } }
      : {}),
    likes: post.likeCount,
    comments: post.commentCount,
    liked,
  };
}

export const communityService = {
  /** The feed and the guild rail beside it. */
  async feed(limit = 20, viewerId?: string | null): Promise<CommunityData> {
    const now = new Date();
    const [postRows, guildRows, likedRows] = await Promise.all([
      db
        .select({
          post: communityPosts,
          handle: profiles.handle,
          role: profiles.role,
          roleTone: profiles.roleTone,
          fallbackName: user.name,
        })
        .from(communityPosts)
        .innerJoin(user, eq(communityPosts.authorId, user.id))
        .leftJoin(profiles, eq(profiles.userId, user.id))
        .orderBy(desc(communityPosts.createdAt))
        .limit(limit),
      db.select().from(guilds).orderBy(asc(guilds.sortOrder)),
      viewerId
        ? db.select({ postId: communityPostLikes.postId }).from(communityPostLikes).where(eq(communityPostLikes.userId, viewerId))
        : Promise.resolve([]),
    ]);

    const likedSet = new Set(likedRows.map((r) => r.postId));
    return {
      posts: postRows.map((row) => toPost(row, now, likedSet.has(row.post.id))),
      guilds: guildRows.map((g) => ({
        name: g.name,
        detail: g.detail ?? "",
        symbol: g.symbol ?? "◆",
        tone: g.tone as CommunityTone,
      })),
    };
  },

  /** Persist a new broadcast post from an authenticated trader. */
  async broadcastPost(authorId: string, input: z.infer<typeof broadcastPostInput>): Promise<CommunityPost> {
    const id = `post-${crypto.randomUUID().slice(0, 8)}`;
    await db.insert(communityPosts).values({
      id,
      authorId,
      guildId: input.guildId ?? null,
      tag: input.tag ?? "BROADCAST",
      tagTone: input.tagTone ?? "primary",
      title: input.title,
      body: input.body && input.body.length > 0 ? input.body : "Broadcast from the Relicto trader community feed.",
      likeCount: 0,
      commentCount: 0,
    });

    const [row] = await db
      .select({
        post: communityPosts,
        handle: profiles.handle,
        role: profiles.role,
        roleTone: profiles.roleTone,
        fallbackName: user.name,
      })
      .from(communityPosts)
      .innerJoin(user, eq(communityPosts.authorId, user.id))
      .leftJoin(profiles, eq(profiles.userId, user.id))
      .where(eq(communityPosts.id, id))
      .limit(1);

    return toPost(row, new Date(), false);
  },

  /** Toggle post like for the authenticated user. */
  async toggleLike(userId: string, postId: string): Promise<{ liked: boolean; likeCount: number }> {
    const [existing] = await db
      .select()
      .from(communityPostLikes)
      .where(and(eq(communityPostLikes.postId, postId), eq(communityPostLikes.userId, userId)))
      .limit(1);

    if (existing) {
      await db.delete(communityPostLikes).where(and(eq(communityPostLikes.postId, postId), eq(communityPostLikes.userId, userId)));
      const [updated] = await db
        .update(communityPosts)
        .set({ likeCount: sql`GREATEST(0, ${communityPosts.likeCount} - 1)` })
        .where(eq(communityPosts.id, postId))
        .returning({ likeCount: communityPosts.likeCount });
      return { liked: false, likeCount: updated?.likeCount ?? 0 };
    }

    await db.insert(communityPostLikes).values({ postId, userId });
    const [updated] = await db
      .update(communityPosts)
      .set({ likeCount: sql`${communityPosts.likeCount} + 1` })
      .where(eq(communityPosts.id, postId))
      .returning({ likeCount: communityPosts.likeCount });
    return { liked: true, likeCount: updated?.likeCount ?? 1 };
  },

  /** Add a reply comment to a community post. */
  async addComment(authorId: string, postId: string, body: string): Promise<{ id: string; commentCount: number }> {
    const commentId = `comm-${crypto.randomUUID().slice(0, 8)}`;
    await db.insert(communityComments).values({ id: commentId, postId, authorId, body });
    const [updated] = await db
      .update(communityPosts)
      .set({ commentCount: sql`${communityPosts.commentCount} + 1` })
      .where(eq(communityPosts.id, postId))
      .returning({ commentCount: communityPosts.commentCount });
    return { id: commentId, commentCount: updated?.commentCount ?? 1 };
  },

  /** Fetch reply comments for a community post. */
  async comments(postId: string): Promise<CommunityComment[]> {
    const now = new Date();
    const rows = await db
      .select({ comment: communityComments, handle: profiles.handle, fallbackName: user.name })
      .from(communityComments)
      .innerJoin(user, eq(communityComments.authorId, user.id))
      .leftJoin(profiles, eq(profiles.userId, user.id))
      .where(eq(communityComments.postId, postId))
      .orderBy(asc(communityComments.createdAt));

    return rows.map((r) => {
      const handle = r.handle ? `@${r.handle}` : `@${r.fallbackName}`;
      return {
        id: r.comment.id,
        postId: r.comment.postId,
        authorId: r.comment.authorId,
        handle,
        initials: initials(handle),
        body: r.comment.body,
        age: ago(r.comment.createdAt, now),
      };
    });
  },
};
