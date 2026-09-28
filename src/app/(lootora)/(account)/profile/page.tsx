import type { Metadata } from "next";
import { ProfileMobile } from "@/modules/profile/components/mobile/profile-mobile";
import { ProfileView } from "@/modules/profile/components/profile-view";
import { getProfile } from "@/modules/profile/data/get-profile";
import { getProfileMobile } from "@/modules/profile/data/get-profile-mobile";

export const metadata: Metadata = {
  title: "Trader Profile",
  description: "Portfolio appraisal, prized collectibles, active listings and escrow reputation.",
};

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function ProfilePage() {
  const [data, mobile] = await Promise.all([getProfile(), getProfileMobile()]);
  return (
    <>
      <div className="md:hidden">
        <ProfileMobile profile={mobile} />
      </div>
      <div className="hidden md:block">
        <ProfileView data={data} />
      </div>
    </>
  );
}
