import "server-only";

import { asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { wikiGuides, wikiRevisions } from "@/lib/db/schema";
import type { IconName } from "@/components/ui/icon";
import type { WikiData, WikiTone } from "@/modules/wiki/types";
import { ago } from "@/server/modules/shared/ago";

export const wikiService = {
  /** Codex landing: the featured guides and the live revision tail. */
  async codex(): Promise<WikiData> {
    const now = new Date();

    const [guides, revisions] = await Promise.all([
      db.select().from(wikiGuides).orderBy(asc(wikiGuides.createdAt)),
      db.select().from(wikiRevisions).orderBy(desc(wikiRevisions.createdAt)).limit(4),
    ]);

    return {
      guides: guides.map((g) => ({
        id: g.slug,
        category: g.category,
        categoryTone: (g.presentation?.categoryTone ?? "muted") as WikiTone,
        title: g.title,
        summary: g.summary,
        meta: g.presentation?.meta ?? (g.readMinutes ? `${g.readMinutes} min read` : ""),
        icon: (g.presentation?.icon ?? "menu_book") as IconName,
        tone: (g.presentation?.tone ?? "muted") as WikiTone,
        kind: g.kind,
      })),
      revisions: revisions.map((r) => ({
        id: r.id,
        title: r.title,
        path: r.path,
        author: r.authorHandle,
        trust: r.trustLabel ?? "Contributor",
        commit: `commit:${r.commitHash}`,
        changes: r.changes,
        time: ago(r.createdAt, now),
        tone: r.tone as WikiTone,
      })),
    };
  },
};
