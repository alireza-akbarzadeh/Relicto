import "server-only";
import { notFound } from "next/navigation";
import type { ItemDetail } from "../types";
import { manifoldParadox } from "./manifold-paradox.mock";

const CATALOG: Record<string, ItemDetail> = { [manifoldParadox.slug]: manifoldParadox };

/** One item page. Mock today; swap for the catalog API without touching the UI. */
export async function getItem(slug: string): Promise<ItemDetail> {
  const item = CATALOG[slug];
  if (!item) notFound();
  return item;
}
