import type { Metadata } from "next";
import { ProfileView } from "@/modules/profile/components/profile-view";
import { getProfile } from "@/modules/profile/data/get-profile";

export const metadata: Metadata = {
  title: "Trader Profile",
  description: "Portfolio appraisal, prized collectibles, active listings and escrow reputation.",
};

export default async function ProfilePage() {
  const data = await getProfile();
  return <ProfileView data={data} />;
}
