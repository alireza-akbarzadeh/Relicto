import type { ProfileData } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { EndorsementsPanel, ReviewCard } from "../sidebar/endorsements-panel";
import { StatusList } from "../sidebar/status-list";
import { SteamSettingsCard } from "./steam-settings-card";
import { TronSettingsCard } from "./tron-settings-card";

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
      {data.reviews.length === 0 && (
        <div className="rounded-xl border border-white/5 bg-surface-card p-6 text-center text-text-muted text-xs">
          No trade reviews recorded yet. Completed trades are automatically verified and eligible for buyer ratings.
        </div>
      )}
    </div>
  );
}

/** Steam links, API scopes, TRON Web3 routing, and webhook endpoints. */
export function LinkedPanel({ data }: { data: ProfileData }) {
  return (
    <div className="flex flex-col gap-space-md">
      <SectionTitle tone="cyan" title="Linked Steam & Web3 Rails" subtitle="Connections this trader account authenticates, deposits, and dispatches trades with." />
      <SteamSettingsCard
        initialTradeUrl={data.identity.tradeUrl}
        steamId={data.identity.steamId}
        openId={data.identity.openId}
      />
      <TronSettingsCard
        initialTronAddress={data.identity.tronAddress}
      />
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
