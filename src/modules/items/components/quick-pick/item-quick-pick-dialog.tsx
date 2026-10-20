"use client";

import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeliverySla } from "@/modules/marketplace/types/delivery";
import { getItemDetailAction } from "../../actions/get-item-detail";
import type { ItemDetail } from "../../types";
import { PriceChart } from "../intelligence/price-chart";
import { OffersSection } from "../offers/offers-section";
import { ValuationTabContent } from "./valuation-tab-content";

type QuickPickTab = "valuation" | "intelligence" | "offers";

export interface QuickPickListing {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  priceUsd: number;
  badge?: { label: string; style: string };
  tag?: { label: string; accent: string };
  detail?: { label: string; accent: string };
  change?: { percent: number; window?: string };
  delivery?: DeliverySla;
}

interface ItemQuickPickDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string | null;
  initialListing?: QuickPickListing | null;
}

export function ItemQuickPickDialog({
  open,
  onOpenChange,
  slug,
  initialListing,
}: ItemQuickPickDialogProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [activeTab, setActiveTab] = useState<QuickPickTab>("valuation");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !slug) return;
    let active = true;
    startTransition(async () => {
      const data = await getItemDetailAction(slug);
      if (active && data) setItem(data);
    });
    return () => {
      active = false;
    };
  }, [open, slug]);

  const name = item?.name ?? initialListing?.name ?? "Asset Inspection";
  const image = item?.hero.image ?? initialListing?.image ?? "";
  const imageAlt = item?.hero.imageAlt ?? initialListing?.imageAlt ?? name;
  const priceUsd = item?.price.lowestUsd ?? initialListing?.priceUsd ?? 0;

  const tabs = [
    {
      value: "valuation" as const,
      content: (
        <span className="flex items-center gap-1.5">
          <Icon name="bolt" className="text-[14px]" />
          Valuation &amp; Buy
        </span>
      ),
    },
    {
      value: "intelligence" as const,
      content: (
        <span className="flex items-center gap-1.5">
          <Icon name="query_stats" className="text-[14px]" />
          Price History
        </span>
      ),
    },
    {
      value: "offers" as const,
      content: (
        <span className="flex items-center gap-1.5">
          <Icon name="storefront" className="text-[14px]" />
          Sellers ({item?.offers?.length ?? "…"})
        </span>
      ),
    },
  ];

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      className="p-4 sm:p-6 space-y-4"
      contentClassName="bg-[#0b0e14]/95 border-white/10 max-w-300!"
      title={
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-primary/20 px-2 py-0.5 font-label-badge text-[10px] font-bold text-primary uppercase">
              {item?.eyebrow.game ?? "MARKET ASSET"}
            </span>
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-badge text-[10px] text-text-secondary uppercase">
              {item?.eyebrow.slot ?? initialListing?.detail?.label ?? "Weapon"}
            </span>
            {slug && (
              <LinkButton
                href={`/items/${slug}`}
                className="ml-auto inline-flex items-center gap-1 text-xs text-tertiary hover:text-white"
              >
                <span>Full Page</span>
                <Icon name="open_in_new" className="text-[14px]" />
              </LinkButton>
            )}
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">
            {name}
          </span>
        </div>
      }
    >
      <SegmentedTabs
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
        label="Quick Pick Navigation"
        listClassName="grid grid-cols-3 rounded-lg bg-surface-container-lowest p-1 border border-white/5"
        tabClassName="py-1.5 font-label-caps text-xs transition-colors data-active:bg-surface-container-high data-active:text-primary data-active:font-bold"
      />

      {activeTab === "valuation" && (
        <ValuationTabContent
          item={item}
          image={image}
          imageAlt={imageAlt}
          priceUsd={priceUsd}
          isPending={isPending}
          name={name}
        />
      )}

      {activeTab === "intelligence" && (
        <div>
          {item?.intelligence ? (
            <PriceChart data={item.intelligence} compact />
          ) : (
            <div className="p-8 text-center">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          )}
        </div>
      )}

      {activeTab === "offers" && (
        <div>
          {item ? (
            <OffersSection item={item} compact />
          ) : (
            <div className="p-8 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
        </div>
      )}
    </ResponsiveDialog>
  );
}
