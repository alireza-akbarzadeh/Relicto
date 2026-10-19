import "server-only";

import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { wikiGuides } from "@/lib/db/schema";
import type { DashboardWikiGuide } from "../types";

export async function getAdminWiki(): Promise<DashboardWikiGuide[]> {
  try {
    const rows = await db
      .select()
      .from(wikiGuides)
      .orderBy(desc(wikiGuides.updatedAt))
      .limit(60);

    return rows.map((g) => ({
      id: g.id,
      slug: g.slug,
      gameId: g.gameId,
      category: g.category,
      title: g.title,
      summary: g.summary,
      kind: g.kind,
      readMinutes: g.readMinutes,
      updatedAt: g.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("[getAdminWiki] Failed to load wiki guides:", err);
    return [];
  }
}
