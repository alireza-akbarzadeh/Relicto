import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketHeader } from "@/modules/relicto/components/shell/market-header";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { ChestOpeningArena } from "@/modules/chests/components/chest-opening-arena";
import { chestsService } from "@/server/modules/chests/chests.service";
import { getUserId } from "@/modules/relicto/data/get-session";
import { walletService } from "@/server/modules/wallet/wallet.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chest = await chestsService.getChestWithUserOdds(slug);
  if (!chest) return { title: "Chest Not Found | Relicto" };

  return {
    title: `${chest.chest.name} - Case Unboxing | Relicto`,
    description: `Inspect odds and unbox ${chest.chest.name} with authentic Dota 2 escalating mechanics and Relicto Coins.`,
  };
}

export default async function ChestDetailPage({ params }: Props) {
  const { slug } = await params;
  const userId = await getUserId();

  const [data, conversion, userWalletCents] = await Promise.all([
    chestsService.getChestWithUserOdds(slug, userId),
    chestsService.getCurrencyConversion(),
    userId ? walletService.liquidCents(userId) : 0,
  ]);

  if (!data) {
    notFound();
  }

  const userCoins = userId ? chestsService.getUserCoins(userId) : 1500;

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      <MarketHeader />

      <main className="flex-1 w-full max-w-5xl mx-auto pt-20 pb-16 px-4 md:px-6">
        <ChestOpeningArena
          chest={data.chest}
          conversion={conversion}
          initialStreak={data.streak}
          escalatingOdds={data.escalatingOdds}
          initialUserCoins={userCoins}
          userWalletCents={userWalletCents}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
