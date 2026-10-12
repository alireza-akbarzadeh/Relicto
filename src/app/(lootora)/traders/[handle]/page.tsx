import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileMobile } from "@/modules/profile/components/mobile/profile-mobile";
import { ProfileView } from "@/modules/profile/components/profile-view";
import { profileMobile } from "@/modules/profile/data/profile-mobile.mock";
import { profileService } from "@/server/modules/profile/profile.service";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { handle } = await params;
  return {
    title: `@${handle} — Trader Storefront | Relicto`,
    description: `Browse verified marketplace listings, trade stats, and showcase items for @${handle}.`,
  };
}

export default async function TraderStorefrontPage({ params }: { params: Params }) {
  const { handle } = await params;
  const [data, mobile] = await Promise.all([
    profileService.publicStorefront(handle),
    profileService.publicStorefrontMobile(handle, profileMobile),
  ]);
  if (!data) notFound();

  return (
    <>
      <div className="md:hidden">
        <ProfileMobile profile={mobile ?? profileMobile} />
      </div>
      <div className="hidden md:block">
        <ProfileView data={data} />
      </div>
    </>
  );
}
