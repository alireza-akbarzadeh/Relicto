import type { ArenaMobileData } from "../../data/get-arena";
import { MobileGameFilterProvider } from "../../hooks/selection";
import { BracketList } from "./brackets/bracket-list";
import { ChampionshipBanner } from "./championship-banner";
import { InfrastructureBento } from "./infrastructure/infrastructure-bento";
import { ServerStatusRibbon } from "./infrastructure/server-status-ribbon";
import { MobileGameTabs } from "./mobile-game-tabs";
import { MobileSearch } from "./mobile-search";
import { RadarFeed } from "./radar/radar-feed";
import { MobileHeader } from "./shell/mobile-header";
import { MobileTabBar } from "./shell/mobile-tab-bar";

/** Mobile Arena hub (Stitch: "Valve Arena - Dota 2 & CS2 Tournaments"). */
export function ArenaMobile({ data }: { data: ArenaMobileData }) {
  return (
    <MobileGameFilterProvider initial="all">
      <MobileHeader shell={data.shell} />
      <main className="relative flex min-h-[max(884px,100dvh)] w-full flex-col bg-surface pt-16 pb-24">
        <div className="flex w-full flex-col pb-12 text-on-surface select-none">
          <MobileGameTabs tabs={data.gameTabs} />
          <ChampionshipBanner data={data.championship} />
          <MobileSearch placeholder={data.search.placeholder} chips={data.search.chips} />
          <BracketList
            section={data.brackets.section}
            cards={data.brackets.cards}
            quickMatch={data.brackets.quickMatch}
          />
          <RadarFeed section={data.radar.section} matches={data.radar.matches} />
          <InfrastructureBento title={data.infrastructure.section.title} items={data.infrastructure.items} />
          <ServerStatusRibbon status={data.infrastructure.server} />
        </div>
      </main>
      <MobileTabBar shell={data.shell} />
    </MobileGameFilterProvider>
  );
}
