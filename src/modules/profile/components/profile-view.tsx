import { LedgerFooter } from "@/modules/relicto/components/shell/footers";
import type { ProfileData } from "../types";
import { ProfileHero } from "./hero/profile-hero";
import { ProfileBoard } from "./profile-board";
import { StatStrip } from "./stats/stat-strip";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";

/** Stitch: "Relicto — User Profile & Trader Identity". */
export function ProfileView({ data }: { data: ProfileData }) {
  return (
    <div className="min-h-screen bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
      <StudioHeader />
      <div className="w-full bg-surface-container-lowest pt-16">
        <div className="flex w-full flex-col">
          <ProfileHero identity={data.identity} />
          <StatStrip stats={data.stats} />
          <ProfileBoard data={data} />
        </div>
      </div>
      <LedgerFooter />
    </div>
  );
}
