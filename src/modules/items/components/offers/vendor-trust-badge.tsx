import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { SellerTrustInfo } from "../../types";

type VendorTrustBadgeProps = {
  seller: SellerTrustInfo;
  compact?: boolean;
};

export function VendorTrustBadge({ seller, compact = false }: VendorTrustBadgeProps) {
  const delivered = seller.itemsDelivered ?? seller.tradesCount ?? 0;
  const trustScore = seller.trustScore ?? 99.5;
  const isElite = delivered >= 1000;
  const isExperienced = delivered >= 100;

  if (compact) {
    return (
      <div
        className="flex items-center gap-1 font-data-mono-md text-[10px]"
        title={`${seller.name}: ${delivered.toLocaleString("en-US")} items sold & delivered via Relicto Escrow (${trustScore}% trust)`}
      >
        <span
          className={cn(
            "flex items-center gap-0.5 rounded px-1.5 py-0.2 font-semibold",
            isElite
              ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
              : isExperienced
                ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                : "bg-surface-container-high text-text-muted"
          )}
        >
          <Icon name={isElite ? "local_fire_department" : "check_circle"} className="text-[11px]" />
          <span>{delivered > 0 ? `${delivered.toLocaleString("en-US")} Sold` : "New Seller"}</span>
        </span>
        <span className="text-emerald-400 font-semibold">{trustScore}%</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-0.5"
      title={`${seller.name}: ${delivered.toLocaleString("en-US")} items sold & delivered via Escrow · ${trustScore}% positive rating`}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={cn(
            "flex items-center gap-1 rounded px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold tracking-tight shadow-xs",
            isElite
              ? "bg-amber-500/15 text-amber-300 border border-amber-500/40"
              : isExperienced
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                : "bg-surface-container-high text-text-secondary border border-white/5"
          )}
        >
          <Icon
            name={isElite ? "workspace_premium" : "verified"}
            className={cn("text-[12px]", isElite ? "text-amber-400" : "text-emerald-400")}
          />
          <span>{delivered > 0 ? `${delivered.toLocaleString("en-US")} Sold & Delivered` : "New Seller"}</span>
        </span>

        <span className="font-data-mono-md text-[10px] font-semibold text-emerald-400">
          {trustScore}% Trust
        </span>
      </div>

      <span className="text-[9.5px] text-text-muted">
        {isElite
          ? "Veteran High-Volume Merchant • 100% Escrow Release"
          : isExperienced
            ? "Consistent Delivery Track Record"
            : "Fully Escrow Protected"}
      </span>
    </div>
  );
}
