import { IntelMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { ProfileMobile as ProfileMobileData } from "../../mobile.types";
import { AccountControls } from "./account-controls";
import { IdentityCard } from "./identity-card";
import { QuickLinks } from "./quick-links";
import { SecurityCard } from "./security-card";
import { ShowcaseRail } from "./showcase-rail";
import { TrustMatrix } from "./trust-matrix";
import { VaultBalance } from "./vault-balance";

/** Mobile trader profile (Stitch: "Lootora Mobile — User Profile & Trader Identity"). */
export function ProfileMobile({ profile }: { profile: ProfileMobileData }) {
  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface">
      <IntelMobileHeader />
      <main className="relative flex w-full flex-col bg-surface pt-16 pb-20">
        <div className="flex w-full flex-col gap-space-md px-space-md py-space-sm">
          <IdentityCard profile={profile} />
          <TrustMatrix stats={profile.trust} />
          <VaultBalance escrow={profile.escrow} />
          <SecurityCard security={profile.security} />
          <ShowcaseRail showcase={profile.showcase} />
          <QuickLinks links={profile.links} />
          <AccountControls savedAccounts={profile.savedAccounts} />
          <div className="flex flex-col items-center justify-center py-2 text-center text-text-muted">
            <div className="flex items-center gap-1 font-label-badge text-[10px] tracking-widest uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              {profile.node}
            </div>
            <span className="mt-0.5 font-body-sm text-[10px] text-text-muted/60">End-to-End Escrow Protection Active</span>
          </div>
        </div>
      </main>
      <MobileTabBar family="intel" active="profile" filled />
    </div>
  );
}
