import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { communityPosts, guilds, profiles, user } from "@/lib/db/schema";
import type { CommunityData, CommunityPost, CommunityTone } from "@/modules/community/types";
import { ago } from "@/server/modules/shared/ago";

type PostRow = {
  post: typeof communityPosts.$inferSelect;
  handle: string | null;
  role: string | null;
  roleTone: string | null;
  fallbackName: string;
};

/**
 * "@Kuro_Vault" and "@StatsDonk" both give two glyphs — handles split on
 * separators or, failing that, on the camel-case hump.
 */
function initials(handle: string) {
  const parts = handle
    .replace(/^@/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[_\-.\s]+/)
    .filter(Boolean);

  const letters = parts.length > 1 ? parts.slice(0, 2).map((p) => p[0]) : [parts[0]?.[0], parts[0]?.[1]];
  return letters.filter(Boolean).join("").toUpperCase();
}

function toPost(row: PostRow, now: Date): CommunityPost {
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
  };
}

export const communityService = {
  /** The feed and the guild rail beside it. */
  async feed(limit = 10): Promise<CommunityData> {
    const now = new Date();

    const [postRows, guildRows] = await Promise.all([
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
    ]);

    return {
      posts: postRows.map((row) => toPost(row, now)),
      guilds: guildRows.map((g) => ({
        name: g.name,
        detail: g.detail ?? "",
        symbol: g.symbol ?? "◆",
        tone: g.tone as CommunityTone,
      })),
    };
  },
};
