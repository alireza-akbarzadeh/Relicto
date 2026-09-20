import type { Metadata } from "next";
import { CommunityView } from "@/modules/community/components/community-view";
import { getCommunity } from "@/modules/community/data/get-community";

export const metadata: Metadata = { title: "Community", description: "Trader community, guilds, market signals and escrow discussion." };

export default async function CommunityPage() {
  return <CommunityView data={await getCommunity()} />;
}
