import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import type { Listing } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { ListingRow } from "./listing-row";

type ListingsSectionProps = {
  listings: Listing[];
  /** Total listings the trader has; the rows may be a preview of them. */
  total: number;
};

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
        {!complete && (
          <NoticeButton
            notice={{ title: `Showing all ${total} listings`, description: "Open the Active Listings tab to manage every listing." }}
            className="h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-label-caps tracking-wider text-primary uppercase transition-colors hover:text-text-primary"
          >
            View All {total} Listings <Icon name="arrow_forward" className="text-[16px]" />
          </NoticeButton>
        )}
      </div>
      <div className="flex flex-col gap-space-xs">
        {listings.map((listing) => (
          <ListingRow key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
