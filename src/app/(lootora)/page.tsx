import type { Metadata } from "next";
import { HubView } from "@/modules/hub/components/hub-view";
import { getHub } from "@/modules/hub/data/get-hub";
import { forbidden, unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Game Hub & Meta Intel",
  description: "Tournament meta, patch impact and pro loadouts mapped to Steam cosmetic prices.",
};

export default async function HomePage() {
  const hub = await getHub();
  return <HubView hub={hub} />;
}
