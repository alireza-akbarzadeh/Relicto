import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProfileMobile } from "@/modules/profile/components/mobile/profile-mobile";
import { ProfileView } from "@/modules/profile/components/profile-view";
import { getProfile } from "@/modules/profile/data/get-profile";
import { getProfileMobile } from "@/modules/profile/data/get-profile-mobile";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("profileTitle"),
    description: t("profileDesc"),
  };
}

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function ProfilePage() {
  const [data, mobile] = await Promise.all([getProfile(), getProfileMobile()]);
  return (
    <>
      <div className="md:hidden">
        <ProfileMobile
          profile={mobile}
          watchlist={data.watchlist}
          bids={data.bids}
          purchases={data.purchases}
          transactions={data.transactions}
          balance={data.balance}
        />
      </div>

      <div className="hidden md:block">
        <ProfileView data={data} />
      </div>
    </>
  );
}
