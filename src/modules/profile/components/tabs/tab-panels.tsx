import type { ProfileData } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { EndorsementsPanel, ReviewCard } from "../sidebar/endorsements-panel";
import { StatusList } from "../sidebar/status-list";

/** Endorsement bars plus every buyer review. */
export function ReviewsPanel({ data }: { data: ProfileData }) {
  return (
    <div className="flex flex-col gap-space-md">
      <SectionTitle
        tone="indigo"
        title="Trade Reputation & Reviews"
        subtitle="Escrow-verified feedback from completed peer-to-peer trades."
      />
      <EndorsementsPanel endorsements={data.endorsements} reviews={[]} reviewCount={data.reviewCount} />
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
        {data.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

/** Steam links, API scopes and webhook endpoints. */
export function LinkedPanel({ data }: { data: ProfileData }) {
  return (
    <div className="flex flex-col gap-space-md">
      <SectionTitle tone="cyan" title="Linked Steam & API" subtitle="Connections this trader account authenticates and dispatches trades with." />
      <div className="rounded-xl bg-surface-card p-space-lg">
        <StatusList rows={data.linked} />
      </div>
    </div>
  );
}

/** Escrow protections applied to every trade. */
export function SafeguardsPanel({ data }: { data: ProfileData }) {
  return (
    <div className="flex flex-col gap-space-md">
      <SectionTitle tone="amber" title="Escrow Safeguards" subtitle="Custody, float locks and payout rules enforced by the Relicto bot network." />
      <div className="rounded-xl bg-surface-card p-space-lg">
        <StatusList rows={data.safeguards} />
      </div>
    </div>
  );
}
