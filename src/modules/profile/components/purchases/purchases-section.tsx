"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import type { BoughtItem } from "../../types";
import { PurchaseCard } from "./purchase-card";

type Filter = "all" | "completed" | "escrow";

export function PurchasesSection({ purchases = [] }: { purchases?: BoughtItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return purchases;
    return purchases.filter((item) => item.state === filter);
  }, [purchases, filter]);

  const totalSpent = useMemo(
    () => purchases.reduce((sum, item) => sum + item.priceUsd, 0),
    [purchases],
  );

  return (
    <section className="flex flex-col gap-space-md">
      {/* Header bar */}
      <div className="flex flex-col justify-between gap-space-sm rounded-xl border border-white/6 bg-surface-card p-space-md sm:flex-row sm:items-center">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Icon name="shopping_bag" className="text-[20px] text-primary" />
            <h2 className="font-headline-sm text-base font-bold text-text-primary uppercase">
              Purchased Items &amp; Deliveries
            </h2>
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-data-mono-md text-xs font-bold text-primary">
              {purchases.length}
            </span>
          </div>
          <p className="font-body-sm text-xs text-text-muted">
            Acquired inventory safeguarded by Relicto Escrow with cryptographic proof of delivery.
          </p>
        </div>

        {/* Total spent chip */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start sm:items-end">
            <span className="font-data-mono-md text-[10px] text-text-muted uppercase">Total Volume</span>
            <span className="font-data-mono-lg text-sm font-bold text-text-primary">
              {formatMoney(totalSpent)} USD
            </span>
          </div>

          <Link
            href="/marketplace"
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-headline-sm text-xs font-bold text-on-primary uppercase shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:opacity-90"
          >
            <Icon name="storefront" className="text-[14px]" />
            <span>Marketplace</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {(
          [
            { id: "all", label: `All (${purchases.length})` },
            { id: "completed", label: `Delivered (${purchases.filter((p) => p.state === "completed").length})` },
            { id: "escrow", label: `In Escrow (${purchases.filter((p) => p.state === "escrow").length})` },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.id}
            variant={null}
            size={null}
            onClick={() => setFilter(tab.id)}
            className={`h-auto rounded-lg px-3 py-1.5 font-headline-sm text-xs font-semibold uppercase transition-colors ${
              filter === tab.id
                ? "bg-primary-container text-on-primary-container font-bold shadow-xs"
                : "bg-surface-card text-text-muted hover:bg-surface-container hover:text-text-primary"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Purchases list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-space-sm">
          {filtered.map((item) => (
            <PurchaseCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-space-md rounded-xl border border-dashed border-white/10 bg-surface-card/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-text-muted">
            <Icon name="shopping_bag" className="text-[24px]" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <span className="font-headline-sm text-sm font-bold text-text-primary">
              {filter === "all" ? "No Purchased Items Yet" : `No ${filter} purchases found`}
            </span>
            <span className="font-body-sm text-xs text-text-muted">
              {filter === "all"
                ? "Browse thousands of CS2 and Dota 2 skins on Relicto with automated trade bot escrow delivery."
                : "Switch to 'All' to view all completed and ongoing trade transactions."}
            </span>
          </div>
          {filter === "all" && (
            <Link
              href="/marketplace"
              className="mt-1 flex items-center gap-1 rounded-lg bg-surface-container-high px-4 py-2 font-headline-sm text-xs font-bold text-text-primary uppercase hover:bg-surface-bright"
            >
              <Icon name="search" className="text-[14px]" />
              <span>Explore Skins</span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
