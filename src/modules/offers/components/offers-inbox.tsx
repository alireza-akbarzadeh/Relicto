import { Icon } from "@/components/ui/icon";
import type { IncomingOffer } from "../types";
import { IncomingOfferRow } from "./incoming-offer-row";

const COLUMNS = ["Asset", "Bidder", "Offer", "Note", "Placed / Expires"];

/**
 * The seller studio's offer inbox: every open bid on the trader's live
 * listings. Accepting opens escrow at the bid; declining tells the buyer.
 */
export function OffersInbox({ offers }: { offers: IncomingOffer[] }) {
  return (
    <section id="offers" className="w-full scroll-mt-24 border-t border-border-subtle px-margin-desktop py-space-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <Icon name="sell" className="text-[18px] text-tertiary" />
            <h2 className="font-headline-md text-base font-bold tracking-wide text-text-primary uppercase">Incoming Offers</h2>
            <span className="rounded bg-tertiary/20 px-2 py-0.5 font-data-mono-md text-[10px] text-tertiary">{offers.length} Open</span>
          </div>
          <span className="font-body-sm text-[11px] text-text-muted">Accepting debits the buyer&apos;s vault and opens escrow at their price.</span>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-card">
          <table className="w-full min-w-225 border-collapse text-left font-body-sm">
            <thead className="bg-surface-container-lowest font-label-caps text-[10px] text-text-muted uppercase">
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column} className="px-3 py-2">{column}</th>
                ))}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <IncomingOfferRow key={offer.id} offer={offer} />
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-3 py-8 text-center font-body-sm text-xs text-text-muted">
                    No open offers. Buyers can bid on any of your live listings from its item page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
