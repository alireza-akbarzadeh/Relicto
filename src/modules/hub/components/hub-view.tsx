import { HubFooter } from "@/modules/relicto/components/shell/hub-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import type { HubData } from "../types";
import { CommunityBoard } from "./community/community-board";
import { LoadoutShowcase } from "./loadouts/loadout-showcase";
import { MetaIndex } from "./meta-index/meta-index";
import { PatchDeltaTable } from "./patch-delta/patch-delta-table";
import { GameStage } from "./stage/game-stage";

/** Stitch: "Relicto PRO - Game Hub & Meta Intel" — the home page. */
export function HubView({ hub }: { hub: HubData }) {
  return (
    <div className="theme-hub min-h-screen bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-white">
      <StudioHeader />
      <main className="min-h-screen w-full bg-surface pt-20">
        <GameStage pulse={hub.pulse} games={hub.games} spotlights={hub.spotlights}>
          <MetaIndex cards={hub.metaCards} />
          <PatchDeltaTable rows={hub.patchDelta} markets={hub.scrapedMarkets} />
          <LoadoutShowcase loadouts={hub.loadouts} />
          <CommunityBoard threads={hub.threads} newThreads={hub.newThreads} incentive={hub.incentive} />
        </GameStage>
      </main>
      <HubFooter />
    </div>
  );
}
