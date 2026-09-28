import type { Metadata } from "next";
import { WikiView } from "@/modules/wiki/components/wiki-view";
import { getWiki } from "@/modules/wiki/data/get-wiki";
import { pageMetadata } from "@/modules/seo/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Dota 2 & CS2 Item Wiki — Floats, Pattern Seeds & Gems",
  description: "Guides to the Dota 2 and CS2 item economy: CS2 float values and pattern seeds, Doppler phases, and Dota 2 prismatic gems and particle effects.",
  path: "/wiki",
});

export default async function WikiPage() {
  return <WikiView data={await getWiki()} />;
}
