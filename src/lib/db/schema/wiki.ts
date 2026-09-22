import { index, integer, pgEnum, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createdAt, primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { games } from "./catalog";

/** Guide families the codex indexes by. */
export const wikiGuideKind = pgEnum("wiki_guide_kind", ["phase", "seed", "gem", "formula"]);

export const wikiGuides = pgTable(
  "wiki_guides",
  {
    id: primaryId(),
    gameId: text("game_id").references(() => games.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    category: text("category").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body"),
    kind: wikiGuideKind("kind").notNull(),
    readMinutes: integer("read_minutes"),
    ...timestamps,
  },
  (t) => [uniqueIndex("wiki_guides_slug_idx").on(t.slug), index("wiki_guides_kind_idx").on(t.kind)],
);

/** Append-only edit history; `path` is the codex tree location shown in the UI. */
export const wikiRevisions = pgTable(
  "wiki_revisions",
  {
    id: primaryId(),
    guideId: text("guide_id").references(() => wikiGuides.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    /** Snapshot of the editor's handle/trust at edit time. */
    authorHandle: text("author_handle").notNull(),
    trustLabel: text("trust_label"),
    title: text("title").notNull(),
    path: text("path").notNull(),
    commitHash: text("commit_hash").notNull(),
    changes: text("changes").notNull(),
    ...createdAt,
  },
  (t) => [index("wiki_revisions_guide_idx").on(t.guideId), index("wiki_revisions_created_at_idx").on(t.createdAt)],
);
