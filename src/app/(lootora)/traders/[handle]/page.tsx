import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/modules/profile/components/profile-view";
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
  const data = await profileService.publicStorefront(handle);
  if (!data) notFound();

  return (
    <div className="w-full">
      <ProfileView data={data} />
    </div>
  );
}
