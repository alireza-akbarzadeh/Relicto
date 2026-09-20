"use client";

import { useQueryState } from "nuqs";
import { profileSearchParams } from "../lib/search-params";
import type { ProfileData, ProfileTab } from "../types";
import { ListingsSection } from "./listings/listings-section";
import { ShowcaseSection } from "./showcase/showcase-section";
import { EndorsementsPanel } from "./sidebar/endorsements-panel";
import { LiquidationCard } from "./sidebar/liquidation-card";
import { SecurityPanel } from "./sidebar/security-panel";
import { LinkedPanel, ReviewsPanel, SafeguardsPanel } from "./tabs/tab-panels";
import { ProfileTabs } from "./tabs/profile-tabs";

function Panel({ tab, data }: { tab: ProfileTab; data: ProfileData }) {
  if (tab === "listings") return <ListingsSection listings={data.listings} total={data.listings.length} />;
  if (tab === "reviews") return <ReviewsPanel data={data} />;
  if (tab === "linked") return <LinkedPanel data={data} />;
  if (tab === "safeguards") return <SafeguardsPanel data={data} />;
  return (
    <>
      <ShowcaseSection items={data.showcase} />
      <ListingsSection listings={data.listings.slice(0, data.listingsShown)} total={data.listings.length} />
    </>
  );
}

/** Tab strip plus the 70/30 body grid; the sidebar stays on every tab. */
export function ProfileBoard({ data }: { data: ProfileData }) {
  const [tab, setTab] = useQueryState("tab", profileSearchParams.tab.withOptions({ history: "replace", clearOnDefault: true }));

  return (
    <>
      <ProfileTabs
        value={tab}
        onChange={(next) => void setTab(next)}
        inventoryCount={data.inventoryCount}
        listingCount={data.listings.length}
        reviewCount={data.reviewCount}
      />
      <main className="w-full px-gutter-desktop py-space-lg">
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
          <div className="flex flex-col gap-space-lg lg:col-span-8">
            <Panel tab={tab} data={data} />
          </div>
          <div className="flex flex-col gap-space-lg lg:col-span-4">
            <SecurityPanel rows={data.security} lastHandshake={data.lastHandshake} />
            <EndorsementsPanel endorsements={data.endorsements} reviews={data.reviews.slice(0, 2)} reviewCount={data.reviewCount} />
            <LiquidationCard />
          </div>
        </div>
      </main>
    </>
  );
}
