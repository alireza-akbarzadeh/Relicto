"use client";

import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import type { ProfileTab } from "../../types";

type ProfileTabsProps = {
  value: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  inventoryCount: number;
  listingCount: number;
  reviewCount: number;
};

/** Tab strip that switches the left column of the profile. */
export function ProfileTabs({ value, onChange, inventoryCount, listingCount, reviewCount }: ProfileTabsProps) {
  const tabs = [
    { value: "showcase" as const, content: `Inventory Showcase (${inventoryCount})` },
    { value: "listings" as const, content: `Active Listings (${listingCount})` },
    { value: "reviews" as const, content: `Trade Reputation & Reviews (${reviewCount})` },
    { value: "linked" as const, content: "Linked Steam & API" },
    { value: "safeguards" as const, content: "Escrow Safeguards" },
  ];

  return (
    <section className="w-full px-gutter-desktop">
      <SegmentedTabs
        label="Profile sections"
        value={value}
        onChange={onChange}
        tabs={tabs}
        listClassName="w-full justify-start gap-space-xs overflow-x-auto rounded-xl bg-surface-card p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabClassName="shrink-0 flex-none rounded-lg border-0 px-space-md py-space-sm font-headline-sm text-[13px] font-semibold tracking-wider text-on-surface-variant uppercase transition-colors hover:bg-surface-container-high hover:text-text-primary data-active:bg-primary-container data-active:px-space-lg data-active:font-bold data-active:text-on-primary-container group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_12px_rgba(244,63,94,0.3)]"
      />
    </section>
  );
}
