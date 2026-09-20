import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Vendor } from "../../types";

/** Verified merchant behind the listing. */
export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface-card p-space-lg shadow-lg">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps font-semibold tracking-wider text-text-muted uppercase">Vendor Identity</span>
        <span className="flex items-center gap-1 rounded bg-status-upcoming/15 px-space-xs py-0.5 font-label-badge text-[10px] font-bold tracking-wider text-status-upcoming uppercase">
          <Icon name="verified" className="text-[12px]" />
          Verified Merchant
        </span>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-surface-deep shadow-sm">
            <Image src={vendor.avatar} alt={vendor.avatarAlt} width={286} height={512} sizes="48px" className="h-full w-full object-cover" />
          </div>
          <span className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full bg-status-upcoming ring-2 ring-surface-card" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm font-bold text-text-primary">{vendor.handle}</span>
            <span className="rounded bg-tertiary-fixed-dim/20 px-1.5 font-label-badge text-[10px] font-bold text-tertiary-fixed-dim">{vendor.tag}</span>
          </div>
          <span className="font-body-sm text-[12px] text-text-muted">{vendor.blurb}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-space-sm rounded-lg bg-surface-container-low p-space-sm font-data-mono-md text-[12px]">
        {vendor.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">{stat.label}</span>
            <span className={cn("font-bold", stat.highlight ? "text-status-upcoming" : "text-text-primary")}>{stat.value}</span>
          </div>
        ))}
      </div>
      <NoticeButton
        notice={{ title: `Opening ${vendor.handle}'s inventory`, description: "Vendor storefronts arrive with the marketplace API." }}
        className="h-auto w-full gap-space-xs rounded-lg border-0 bg-surface-container py-space-sm font-label-caps text-label-caps text-text-secondary uppercase transition-colors hover:bg-surface-container-high hover:text-text-primary"
      >
        <Icon name="storefront" className="text-[16px]" />
        <span>View Vendor Inventory</span>
      </NoticeButton>
    </div>
  );
}
