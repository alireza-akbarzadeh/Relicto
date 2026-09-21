import type { Metadata } from "next";
import { HubView } from "@/modules/hub/components/hub-view";
import { HubMobile } from "@/modules/hub/components/mobile/hub-mobile";
import { getHub, getHubMobile } from "@/modules/hub/data/get-hub";

export const metadata: Metadata = {
  title: "Game Hub & Meta Intel",
  description: "Tournament meta, patch impact and pro loadouts mapped to Steam cosmetic prices.",
};

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function HomePage() {
  const [hub, mobile] = await Promise.all([getHub(), getHubMobile()]);
  return (
    <>
      <div className="md:hidden">
        <HubMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <HubView hub={hub} />
      </div>
    </>
  );
}
