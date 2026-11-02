import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import type { HubData } from "../types";
import { CommunityBoard } from "./community/community-board";
import { LoadoutShowcase } from "./loadouts/loadout-showcase";
import { MetaIndex } from "./meta-index/meta-index";
import { PatchDeltaTable } from "./patch-delta/patch-delta-table";
import { GameStage } from "./stage/game-stage";
import { HubChestsShowcase } from "./chests/hub-chests-showcase";

/** Stitch: "Relicto PRO - Game Hub & Meta Intel" — the home page. */
export function HubView({ hub }: { hub: HubData }) {
  return (
    <div className="theme-hub min-h-screen bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-white">
      <StudioHeader />
      <main className="min-h-screen w-full bg-surface pt-20">
        <GameStage pulse={hub.pulse} games={hub.games} spotlights={hub.spotlights}>
          {/* Below-the-fold content: defer layout & paint off-screen */}
          <div className="content-auto">
            <HubChestsShowcase initialChests={hub.chests} />
          </div>
          <div className="content-auto">
            <MetaIndex cards={hub.metaCards} />
          </div>
          <div className="content-auto">
            <PatchDeltaTable rows={hub.patchDelta} markets={hub.scrapedMarkets} />
          </div>
          <div className="content-auto">
            <LoadoutShowcase loadouts={hub.loadouts} />
          </div>
          <div className="content-auto">
            <CommunityBoard threads={hub.threads} newThreads={hub.newThreads} incentive={hub.incentive} />
          </div>
        </GameStage>
      </main>
      <SiteFooter />
    </div>
  );
}
