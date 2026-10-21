import type { Metadata } from "next";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { findOrOpenProfile } from "@/server/modules/profile/profile.repository";
import { KycView } from "@/modules/kyc/components/kyc-view";

export const metadata: Metadata = {
  title: "احراز هویت فروشنده | Relicto KYC",
  description: "تکمیل احراز هویت جهت فروش بدون کارمزد اضافه، تسویه آنی و دریافت نشان معامله‌گر تایید شده.",
};

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
