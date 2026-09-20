import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Endorsement, Review } from "../../types";
import { Meter } from "../shared/meter";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-label-badge text-label-badge font-bold text-text-primary">{review.author}</span>
        <span className="font-label-badge text-[10px] text-text-muted">{review.age}</span>
      </div>
      <p className="font-body-sm text-body-sm text-text-secondary italic">&quot;{review.quote}&quot;</p>
    </div>
  );
}

type EndorsementsPanelProps = {
  endorsements: Endorsement[];
  reviews: Review[];
  reviewCount: number;
  className?: string;
};

/** Verified trade metrics with the latest bot-trade feedback. */
export function EndorsementsPanel({ endorsements, reviews, reviewCount, className }: EndorsementsPanelProps) {
  return (
    <section className={cn("flex flex-col gap-space-md rounded-xl bg-surface-card p-space-lg", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="hotel_class" className="text-[20px] text-tertiary" />
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary uppercase">Trader Endorsements</span>
        </div>
        <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">{reviewCount} REVIEWS</span>
      </div>
      <div className="flex flex-col gap-space-sm">
        {endorsements.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between font-label-badge text-label-badge">
              <span className="text-text-secondary uppercase">{item.label}</span>
              <span className="font-bold text-text-primary">{item.value}</span>
            </div>
            <Meter pct={item.pct} tone={item.tone} trackClassName="bg-surface-container-high" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">Latest Bot Trade Feedback</span>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
