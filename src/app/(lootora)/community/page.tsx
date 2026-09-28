import type { Metadata } from "next";
import { CommunityView } from "@/modules/community/components/community-view";
import { getCommunity } from "@/modules/community/data/get-community";
import { pageMetadata } from "@/modules/seo/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Trader Community — Dota 2 & CS2 Market Talk",
  description: "Posts from Relicto traders: Dota 2 and CS2 market signals, price moves, trading guilds and escrow questions.",
  path: "/community",
});

export default async function CommunityPage() {
  return <CommunityView data={await getCommunity()} />;
}
