"use client";

import { useQueryState } from "nuqs";
import { IntelMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import type { BuyerBid } from "@/modules/offers/types";
import { profileSearchParams } from "../../lib/search-params";
import type { ProfileMobile as ProfileMobileData } from "../../mobile.types";
import type { WatchedItem } from "../../types";
import { BidsSection } from "../bids/bids-section";
import { WatchlistSection } from "../watchlist/watchlist-section";
import { AccountControls } from "./account-controls";
import { IdentityCard } from "./identity-card";
import { QuickLinks } from "./quick-links";
import { SecurityCard } from "./security-card";
import { ShowcaseRail } from "./showcase-rail";
import { TrustMatrix } from "./trust-matrix";
import { VaultBalance } from "./vault-balance";

type ProfileMobileProps = {
  profile: ProfileMobileData;
  watchlist?: WatchedItem[];
  bids?: BuyerBid[];
  isPublic?: boolean;
};

/** Mobile trader profile with live showcase, watchlist and bids tabs. */
export function ProfileMobile({ profile, watchlist = [], bids = [], isPublic = false }: ProfileMobileProps) {
  const [tab, setTab] = useQueryState(
    "tab",
    profileSearchParams.tab.withOptions({ history: "replace", clearOnDefault: true }),
  );

  const tabs = [
    { value: "showcase" as const, content: `Showcase (${profile.showcase.total})` },
    ...(!isPublic || watchlist.length > 0 ? [{ value: "watchlist" as const, content: `Watchlist (${watchlist.length})` }] : []),
    ...(!isPublic && bids.length > 0 ? [{ value: "bids" as const, content: `Bids (${bids.length})` }] : []),
  ];

  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface">
      <IntelMobileHeader />
      <main className="relative flex w-full flex-col bg-surface pt-16 pb-20">
        <div className="flex w-full flex-col gap-space-md px-space-md py-space-sm">
          <IdentityCard profile={profile} />
          <TrustMatrix stats={profile.trust} />
          {!isPublic && <VaultBalance escrow={profile.escrow} />}
          <SecurityCard security={profile.security} />

          <SegmentedTabs
            label="Mobile profile sections"
            value={tab === "watchlist" || tab === "bids" ? tab : "showcase"}
            onChange={(next) => void setTab(next)}
            tabs={tabs}
            listClassName="w-full justify-start gap-space-xs overflow-x-auto rounded-xl bg-surface-card p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            tabClassName="shrink-0 flex-1 rounded-lg border-0 py-2 font-headline-sm text-[12px] font-semibold tracking-wider text-on-surface-variant uppercase transition-colors hover:bg-surface-container-high hover:text-text-primary data-active:bg-primary-container data-active:font-bold data-active:text-on-primary-container group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_12px_rgba(244,63,94,0.3)]"
          />

          {tab === "watchlist" ? (
            <WatchlistSection items={watchlist} />
          ) : tab === "bids" ? (
            <BidsSection bids={bids} />
          ) : (
            <>
              <ShowcaseRail showcase={profile.showcase} />
              <QuickLinks links={profile.links} />
              {!isPublic && <AccountControls savedAccounts={profile.savedAccounts} />}
            </>
          )}

          <div className="flex flex-col items-center justify-center py-2 text-center text-text-muted">
            <div className="flex items-center gap-1 font-label-badge text-[10px] tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              {profile.node}
            </div>
            <span className="mt-0.5 font-body-sm text-[10px] text-text-muted/60">End-to-End Escrow Protection Active</span>
          </div>
        </div>
      </main>
      <MobileTabBar family="intel" active="profile" filled />
    </div>
  );
}
