"use client";

import { useQueryStates } from "nuqs";
import { itemSearchParams } from "../../lib/search-params";
import { NoticeButton } from "@/components/notice-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import type { Offer } from "../../types";
import { OfferRow } from "./offer-row";

const COLUMNS = ["Seller Authority", "Variant & Inscribed Gems", "Fulfillment Mode", "Listing Price", "Quick Checkout"];

type OffersSectionProps = { offers: Offer[]; note: string; styles: string[] };

/** Live seller offers with the style filter and escrow toggles. */
export function OffersSection({ offers, note, styles }: OffersSectionProps) {
  const [{ offers: style, bot: botOnly, verified: verifiedOnly }, setQuery] = useQueryStates(
    { offers: itemSearchParams.offers, bot: itemSearchParams.bot, verified: itemSearchParams.verified },
    { history: "replace", clearOnDefault: true },
  );

  /** "Verified" means a verified badge or a 99%+ positive rating. */
  const trusted = (offer: Offer) => offer.seller.verified || Number.parseFloat(offer.seller.rating) >= 99;

  const visible = offers.filter((offer) => {
    if (style !== "ALL" && !offer.style.label.toLowerCase().startsWith(style.toLowerCase())) return false;
    if (botOnly && offer.fulfilment !== "bot") return false;
    if (verifiedOnly && !trusted(offer)) return false;
    return true;
  });

  return (
    <section id="offers" className="flex w-full scroll-mt-40 flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 pb-1 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="storefront" className="text-[24px] text-tertiary" />
            <h2 className="font-headline-lg text-2xl font-bold tracking-tight text-text-primary">Active Market Listings</h2>
          </div>
          <p className="mt-1 font-body-md text-sm text-text-muted">Verified Steam peer inventory and automated zero-wait escrow dispatch nodes.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-border-subtle bg-surface-container px-2.5 py-1 font-label-badge text-xs text-text-secondary">{note}</span>
          <NoticeButton
            notice={{ title: "Refine filters", description: "Advanced offer filters arrive with the marketplace API." }}
            className="h-auto gap-1 rounded border-border-subtle bg-surface-container px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:bg-surface-container-high hover:text-text-primary"
          >
            <Icon name="tune" className="text-[16px]" />
            <span>Refine Filters</span>
          </NoticeButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-card p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-label-badge text-xs text-text-muted uppercase">Style:</span>
          {styles.map((option) => (
            <Button
              key={option}
              variant={null}
              size={null}
              onClick={() => void setQuery({ offers: option })}
              aria-pressed={style === option}
              className={cn(
                "h-auto rounded border-0 px-2.5 py-1 font-data-mono-md text-xs transition-colors",
                style === option
                  ? "border border-border-tactical bg-surface-container-high font-bold text-tertiary"
                  : "font-normal text-text-muted hover:bg-surface-container hover:text-text-primary",
              )}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Label className="flex cursor-pointer items-center gap-2 text-xs font-normal text-text-secondary select-none">
            <Checkbox checked={botOnly} onCheckedChange={(next) => void setQuery({ bot: next === true })} />
            <span>Instant Bot Trade Escrow Only</span>
          </Label>
          <Label className="hidden cursor-pointer items-center gap-2 text-xs font-normal text-text-secondary select-none sm:flex">
            <Checkbox checked={verifiedOnly} onCheckedChange={(next) => void setQuery({ verified: next === true })} />
            <span>Verified Traders (99%+)</span>
          </Label>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-border-subtle bg-surface-card shadow-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-container-lowest font-label-caps text-xs tracking-wider text-text-muted uppercase">
              {COLUMNS.map((column, index) => (
                <th key={column} className={cn("px-4 py-3", index === COLUMNS.length - 1 && "text-right")}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle font-body-sm text-xs">
            {visible.map((offer) => (
              <OfferRow key={offer.id} offer={offer} />
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center font-body-sm text-xs text-text-muted">
                  No offers match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between font-body-sm text-xs text-text-muted">
        <span>
          Showing {visible.length} of 124 offers available worldwide
        </span>
        <NoticeButton
          notice={{ title: "All 124 listings", description: "The full offer book opens with the marketplace API." }}
          className="inline-flex h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-xs font-bold text-tertiary transition-colors hover:text-text-primary"
        >
          <span>VIEW ALL 124 LISTINGS</span>
          <Icon name="arrow_forward" className="text-[16px]" />
        </NoticeButton>
      </div>
    </section>
  );
}
