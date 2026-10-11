import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import type { Listing } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { ListingRow } from "./listing-row";

type ListingsSectionProps = {
  listings: Listing[];
  /** Total listings the trader has; the rows may be a preview of them. */
  total: number;
};

function EmptyListings() {
  return (
    <div className="flex flex-col items-center gap-space-sm rounded-xl border border-white/6 bg-surface-card px-space-lg py-space-xl text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low text-text-muted">
        <Icon name="sell" className="text-[28px]" />
      </div>
      <span className="font-headline-sm text-headline-sm font-bold text-text-primary">No active listings</span>
      <p className="max-w-sm font-body-sm text-body-sm text-text-muted">
        You do not have any items listed on the exchange right now. List items from your inventory to start earning.
      </p>
      <LinkButton href="/sell" className="mt-space-xs">
        Create a Listing
      </LinkButton>
    </div>
  );
}

/** Items the trader currently has for sale on the exchange. */
export function ListingsSection({ listings, total }: ListingsSectionProps) {
  const complete = listings.length >= total;
  return (
    <div className="mt-space-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <SectionTitle
          tone="crimson"
          title="Active Listed Items for Sale"
          chip={
            <span className="ml-space-xs rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge text-text-muted">
              {listings.length} OF {total} SHOWN
            </span>
          }
        />
        {listings.length > 0 && !complete && (
          <LinkButton
            href="/marketplace"
            className="h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-label-caps tracking-wider text-primary uppercase transition-colors hover:text-text-primary"
          >
            <span>View All {total} Listings</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </LinkButton>
        )}
      </div>
      {listings.length === 0 ? (
        <EmptyListings />
      ) : (
        <div className="flex flex-col gap-space-xs">
          {listings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
