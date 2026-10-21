"use client";

import { useTranslations } from "next-intl";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import type { ProfileTab } from "../../types";

type ProfileTabsProps = {
  value: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  inventoryCount: number;
  purchasesCount?: number;
  transactionsCount?: number;
  listingCount: number;
  watchlistCount: number;
  bidsCount?: number;
  reviewCount: number;
};

/** Tab strip that switches the left column of the profile. */
export function ProfileTabs({
  value,
  onChange,
  inventoryCount,
  purchasesCount = 0,
  transactionsCount = 0,
  listingCount,
  watchlistCount,
  bidsCount = 0,
  reviewCount,
}: ProfileTabsProps) {
  const t = useTranslations("profile");

  const tabs = [
    { value: "showcase" as const, content: t("tabShowcase", { count: inventoryCount }) },
    { value: "purchases" as const, content: t("tabPurchases", { count: purchasesCount }) },
    { value: "transactions" as const, content: t("tabTransactions", { count: transactionsCount }) },
    { value: "listings" as const, content: t("tabListings", { count: listingCount }) },
    { value: "watchlist" as const, content: t("tabWatchlist", { count: watchlistCount }) },
    { value: "bids" as const, content: t("tabBids", { count: bidsCount }) },
    { value: "reviews" as const, content: t("tabReviews", { count: reviewCount }) },
    { value: "linked" as const, content: t("tabLinked") },
    { value: "safeguards" as const, content: t("tabSafeguards") },
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
