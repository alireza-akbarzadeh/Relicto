import type { Metadata } from "next";
import { WikiView } from "@/modules/wiki/components/wiki-view";
import { getWiki } from "@/modules/wiki/data/get-wiki";

export const metadata: Metadata = { title: "Wiki", description: "Valve skin economy, pattern seed, float math and gem research codex." };

export default async function WikiPage() {
  return <WikiView data={await getWiki()} />;
}
