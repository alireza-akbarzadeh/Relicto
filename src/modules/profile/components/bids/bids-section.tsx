"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { formatMoney } from "@/lib/format";
import { withdrawOffer } from "@/modules/offers/actions/offers";
import type { BuyerBid } from "@/modules/offers/types";
import { SectionTitle } from "../shared/section-title";

export function BidsSection({ bids }: { bids: BuyerBid[] }) {
  const [pending, startTransition] = useTransition();

  const handleWithdraw = (bidId: string, itemName: string) => {
    startTransition(async () => {
      try {
        const result = await withdrawOffer({ offerId: bidId });
        if (result.ok) {
          toast.success("Offer withdrawn", {
            description: `Your bid on ${itemName} was cancelled and removed.`,
          });
        } else {
          toast.error("Couldn't withdraw offer", {
            description: "The offer may have already been accepted or expired.",
          });
        }
      } catch {
        toast.error("Network error while withdrawing offer");
      }
    });
  };

  return (
    <section className="flex flex-col gap-space-md">
      <SectionTitle
        tone="amber"
        title="Active Marketplace Bids"
        subtitle="Open purchase offers you have placed on marketplace listings awaiting seller decisions."
      />
      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl border border-white/8 bg-surface-card p-space-xl text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-tertiary">
            <Icon name="tag" className="text-[24px]" />
          </div>
          <h3 className="font-headline-sm text-base font-bold text-text-primary uppercase">No Active Bids</h3>
          <p className="max-w-md font-body-sm text-xs text-text-muted">
            You don&apos;t have any open offers placed. You can make offers below ask price on any active listing from its item page.
          </p>
          <LinkButton href="/marketplace" className="mt-2 h-auto rounded bg-primary px-4 py-2 font-headline-sm text-xs font-bold text-white uppercase hover:bg-primary/90">
            Browse Marketplace
          </LinkButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          {bids.map((bid) => (
            <article key={bid.id} className="relative flex flex-col justify-between gap-space-sm rounded-xl border border-white/8 bg-surface-card p-space-md shadow-md transition-all hover:border-white/15">
              <div className="flex items-start gap-space-sm">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-surface-container-lowest">
                  <Image src={bid.item.image} alt={bid.item.imageAlt} fill sizes="56px" className="object-cover" />
                  {bid.item.wear && (
                    <span className="absolute bottom-1 right-1 rounded bg-surface-deep/90 px-1 font-data-mono-md text-[9px] font-bold text-status-upcoming">
                      {bid.item.wear}
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/items/${bid.item.slug}`} className="truncate font-headline-sm text-sm font-bold text-text-primary hover:text-primary transition-colors">
                    {bid.item.name}
                  </Link>
                  <span className="font-data-mono-md text-[11px] text-text-muted">
                    Seller: <strong className="text-text-secondary">{bid.seller.handle}</strong> ({bid.seller.trust})
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-status-upcoming/15 px-1.5 py-0.5 font-data-mono-md text-[10px] font-semibold text-status-upcoming">
                      {bid.expires}
                    </span>
                    <span className="font-data-mono-md text-[10px] text-text-muted">
                      Placed {bid.placed}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/6 pt-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-data-mono-md">
                    <span className="text-base font-bold text-tertiary">{formatMoney(bid.bidUsd)}</span>
                    <span className="text-xs text-text-muted line-through">Ask {formatMoney(bid.askUsd)}</span>
                  </div>
                  <span className="font-data-mono-md text-[10px] text-primary">{bid.discount} below ask</span>
                </div>
                <Button
                  variant={null}
                  size={null}
                  disabled={pending}
                  onClick={() => handleWithdraw(bid.id, bid.item.name)}
                  className="h-auto rounded border border-white/10 bg-surface-container px-3 py-1.5 font-label-caps text-xs text-text-secondary uppercase hover:bg-surface-bright hover:text-text-primary"
                >
                  <Icon name="close" className="mr-1 text-[13px]" />
                  Withdraw
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
