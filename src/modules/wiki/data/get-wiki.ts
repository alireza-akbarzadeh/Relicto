import "server-only";
import { rethrowNextSignals } from "@/lib/next-signals";
import { wikiService } from "@/server/modules/wiki/wiki.service";
import type { WikiData } from "../types";
import { wiki } from "./wiki.mock";

/**
 * The codex, from Postgres. Falls back to the sample guides until the wiki
 * tables are seeded, so the screen never renders empty.
 */
export async function getWiki(): Promise<WikiData> {
  try {
    const live = await wikiService.codex();
    return live.guides.length > 0 ? live : wiki;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getWiki] Fallback to mock:", err);
    return wiki;
  }
}
