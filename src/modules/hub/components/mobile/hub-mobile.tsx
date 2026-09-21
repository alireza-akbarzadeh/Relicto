import { LinkedMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { HubMobileData } from "../../mobile.types";
import { ArenaCard } from "./arena-card";
import { BattleCarousel } from "./battle-carousel";
import { EventPills } from "./event-pills";
import { MetaIntel } from "./meta-intel";
import { SurgeIndex } from "./surge-index";

/** Mobile game hub (Stitch: "Lootora Mobile — Esports & Meta Intel Hub"). */
export function HubMobile({ data }: { data: HubMobileData }) {
  return (
    <div className="flex flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <LinkedMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface pt-16 pb-24">
        <div className="flex w-full flex-col gap-4 pb-6">
          <EventPills events={data.events} />
          <ArenaCard matches={data.matches} />
          <BattleCarousel battles={data.battles} />
          <SurgeIndex surge={data.surge} />
          <MetaIntel heroes={data.heroes} />
        </div>
      </main>
      <MobileTabBar family="linked" active="esports" />
    </div>
  );
}
