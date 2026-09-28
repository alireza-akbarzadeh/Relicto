import "server-only";
import { cache } from "react";
import { findItemSeo } from "@/server/modules/items/items.seo";

/** An item's search-facing facts; cached so metadata and the page share one query. */
export const getItemSeo = cache(async (slug: string) => findItemSeo(slug));
