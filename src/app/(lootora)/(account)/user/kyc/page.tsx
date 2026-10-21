import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { findOrOpenProfile } from "@/server/modules/profile/profile.repository";
import { KycView } from "@/modules/kyc/components/kyc-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("kycTitle"),
    description: t("kycDesc"),
  };
}

export default async function UserKycPage() {
  const userId = await requireUserId();
  const profile = await findOrOpenProfile(userId);

  return (
    <main className="w-full bg-canvas-base pt-20 pb-16">
      <KycView
        handle={profile?.handle}
        tradeUrl={profile?.tradeUrl ?? undefined}
        realName={profile?.realName ?? undefined}
      />
    </main>
  );
}
