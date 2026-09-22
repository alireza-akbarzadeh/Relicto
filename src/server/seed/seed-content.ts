/**
 * Community feed + wiki codex, seeded from `community.mock` / `wiki.mock` so
 * `/community` and `/wiki` render the same screens against Postgres.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { community } from "../../modules/community/data/community.mock";
import { wiki } from "../../modules/wiki/data/wiki.mock";

type Db = NodePgDatabase<typeof schema>;

const MINUTE = 60 * 1000;

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Post authors, created as real accounts so the feed joins like it will in production. */
const AUTHORS = community.posts.map((post) => ({
  id: `seed-user-${slugify(post.handle)}`,
  handle: post.handle.replace(/^@/, ""),
  role: post.role,
  roleTone: post.roleTone,
  age: post.age,
}));

/** The feed's relative stamps, back-dated so `ago()` reproduces them. */
const AGE_MINUTES: Record<string, number> = { "14m ago": 14, "2h ago": 120, "4h ago": 240 };
const REVISION_MINUTES = [12, 102, 250, 495];

export async function seedContent(db: Db) {
  await db
    .insert(schema.user)
    .values(
      AUTHORS.map((a) => ({
        id: a.id,
        name: a.handle,
        email: `${slugify(a.handle)}@relicto.seed`,
        emailVerified: true,
      })),
    )
    .onConflictDoNothing();

  for (const author of AUTHORS) {
    const profile = {
      id: `profile-${slugify(author.handle)}`,
      userId: author.id,
      handle: author.handle,
      role: author.role,
      roleTone: author.roleTone,
    } satisfies typeof schema.profiles.$inferInsert;

    await db.insert(schema.profiles).values(profile).onConflictDoUpdate({ target: schema.profiles.id, set: profile });
  }

  for (const [order, guild] of community.guilds.entries()) {
    const row = {
      id: `guild-${slugify(guild.name)}`,
      sortOrder: order,
      slug: slugify(guild.name),
      name: guild.name,
      detail: guild.detail,
      symbol: guild.symbol,
      tone: guild.tone,
      /** The leading figure in the detail line is the member count. */
      memberCount: Math.round(Number(guild.detail.match(/([\d.]+)k/)?.[1] ?? 0) * 1000),
    } satisfies typeof schema.guilds.$inferInsert;

    await db.insert(schema.guilds).values(row).onConflictDoUpdate({ target: schema.guilds.id, set: row });
  }

  const now = Date.now();

  for (const post of community.posts) {
    const row = {
      id: `post-${post.id}`,
      authorId: `seed-user-${slugify(post.handle)}`,
      tag: post.tag,
      tagTone: post.tagTone,
      title: post.title,
      body: post.body,
      image: post.image ?? null,
      metricLabel: post.metric?.label ?? null,
      metricValue: post.metric?.value ?? null,
      metricDelta: post.metric?.delta ?? null,
      likeCount: post.likes,
      commentCount: post.comments,
      createdAt: new Date(now - (AGE_MINUTES[post.age] ?? 60) * MINUTE),
    } satisfies typeof schema.communityPosts.$inferInsert;

    await db
      .insert(schema.communityPosts)
      .values(row)
      .onConflictDoUpdate({ target: schema.communityPosts.id, set: row });
  }

  await seedWiki(db, now);
  return { posts: community.posts.length, guides: wiki.guides.length };
}

async function seedWiki(db: Db, now: number) {
  for (const guide of wiki.guides) {
    const row = {
      id: `guide-${guide.id}`,
      slug: guide.id,
      category: guide.category,
      title: guide.title,
      summary: guide.summary,
      kind: guide.kind,
      readMinutes: Number(guide.meta.match(/(\d+) min read/)?.[1] ?? 0) || null,
      presentation: {
        categoryTone: guide.categoryTone,
        tone: guide.tone,
        icon: guide.icon,
        meta: guide.meta,
      },
    } satisfies typeof schema.wikiGuides.$inferInsert;

    await db.insert(schema.wikiGuides).values(row).onConflictDoUpdate({ target: schema.wikiGuides.id, set: row });
  }

  for (const [index, revision] of wiki.revisions.entries()) {
    const row = {
      id: `revision-${revision.id}`,
      authorHandle: revision.author,
      trustLabel: revision.trust,
      title: revision.title,
      path: revision.path,
      commitHash: revision.commit.replace(/^commit:/, ""),
      changes: revision.changes,
      tone: revision.tone,
      createdAt: new Date(now - (REVISION_MINUTES[index] ?? 60) * MINUTE),
    } satisfies typeof schema.wikiRevisions.$inferInsert;

    await db.insert(schema.wikiRevisions).values(row).onConflictDoUpdate({ target: schema.wikiRevisions.id, set: row });
  }
}
