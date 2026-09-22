import { index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";

export const guilds = pgTable(
  "guilds",
  {
    id: primaryId(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    detail: text("detail"),
    /** Single-glyph sigil rendered on the guild chip ("♛", "◈"). */
    symbol: text("symbol"),
    /** Accent the guild chip renders in ("amber", "cyan", "indigo", "primary"). */
    tone: text("tone").notNull().default("muted"),
    memberCount: integer("member_count").notNull().default(0),
    /** Position in the guild rail — curated, not ranked by size. */
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("guilds_slug_idx").on(t.slug)],
);

export const communityPosts = pgTable(
  "community_posts",
  {
    id: primaryId(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    guildId: text("guild_id").references(() => guilds.id, { onDelete: "set null" }),
    tag: text("tag"),
    /** Accent for the tag pill above the post title. */
    tagTone: text("tag_tone").notNull().default("muted"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    image: text("image"),
    /** Optional stat block attached to a post ("Net Verified Yield", "+340.4%"). */
    metricLabel: text("metric_label"),
    metricValue: text("metric_value"),
    metricDelta: text("metric_delta"),
    /** Denormalized counters; the join tables below are the source of truth. */
    likeCount: integer("like_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("community_posts_author_idx").on(t.authorId),
    index("community_posts_guild_idx").on(t.guildId),
    index("community_posts_created_at_idx").on(t.createdAt),
  ],
);

export const communityPostLikes = pgTable(
  "community_post_likes",
  {
    id: primaryId(),
    postId: text("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...createdAt,
  },
  (t) => [uniqueIndex("community_post_likes_post_user_idx").on(t.postId, t.userId)],
);

export const communityComments = pgTable(
  "community_comments",
  {
    id: primaryId(),
    postId: text("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    ...timestamps,
  },
  (t) => [index("community_comments_post_idx").on(t.postId)],
);

export const guildMembers = pgTable(
  "guild_members",
  {
    id: primaryId(),
    guildId: text("guild_id")
      .notNull()
      .references(() => guilds.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...createdAt,
  },
  (t) => [uniqueIndex("guild_members_guild_user_idx").on(t.guildId, t.userId)],
);
