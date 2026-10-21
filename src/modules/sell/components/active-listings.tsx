"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DelistButton } from "./delist-button";
import type { SellData } from "../types";

export type ActiveListingsProps = {
  data: SellData;
  onRefresh: () => void;
};

export function ActiveListings({ data, onRefresh }: ActiveListingsProps) {
  const t = useTranslations("activeListings");

  return (
    <section className="w-full border-t border-white/6 px-margin-desktop py-space-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <h2 className="font-headline-md text-base font-bold tracking-wide text-text-primary uppercase">
              {t("title")}
            </h2>
            <span className="rounded bg-primary/20 px-2 py-0.5 font-data-mono-md text-[10px] text-primary">
              {t("onSaleCount", { count: data.activeListings.length })}
            </span>
          </div>
          <Button
            variant={null}
            size={null}
            onClick={onRefresh}
            className="h-auto gap-1 rounded bg-surface-container-high px-2 py-1.5 font-label-caps text-[10px] text-text-primary uppercase hover:bg-surface-bright"
          >
            <Icon name="refresh" className="text-[14px]" />
            {t("refreshBtn")}
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-white/8 bg-surface-card">
          <table className="w-full min-w-225 border-collapse text-left font-body-sm">
            <thead className="bg-surface-container-lowest font-label-caps text-[10px] text-text-muted uppercase">
              <tr>
                <th className="px-3 py-2">{t("colIntel")}</th>
                <th className="px-3 py-2">{t("colPrice")}</th>
                <th className="px-3 py-2">{t("colFloorDelta")}</th>
                <th className="px-3 py-2">{t("colBuyerTelemetry")}</th>
                <th className="px-3 py-2">{t("colAge")}</th>
                <th className="px-3 py-2 text-right">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.activeListings.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-t border-white/4 transition-colors hover:bg-surface-container-high/30"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded bg-surface-container-lowest">
                        <Image
                          src={listing.image}
                          alt={listing.imageAlt}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-[13px] font-semibold text-text-primary">
                          {listing.name}
                        </span>
                        <span className="font-data-mono-md text-[10px] text-text-muted">
                          {t("intelVerified")}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-data-mono-md font-bold text-tertiary">
                    {listing.price}
                  </td>
                  <td className="px-3 py-2.5 font-data-mono-md text-[11px] text-status-upcoming">
                    {listing.floorDelta}
                  </td>
                  <td className="px-3 py-2.5 font-data-mono-md text-[11px] text-text-secondary">
                    {listing.buyerViews} · <span className="text-primary">{listing.offers}</span>
                  </td>
                  <td className="px-3 py-2.5 font-data-mono-md text-[11px] text-text-muted">
                    {listing.age}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <DelistButton
                        listingId={listing.id}
                        name={listing.name}
                        className="h-auto rounded border-0 bg-primary/20 px-2 py-1 font-label-caps text-[10px] text-primary uppercase"
                      >
                        {t("delist")}
                      </DelistButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
