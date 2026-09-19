import type { ArenaDesktopData } from "../../data/get-arena";
import { FeaturedGameProvider } from "../../hooks/selection";
import { ArenaDiscovery } from "./arenas/arena-discovery";
import { HeroShowcase } from "./hero/hero-showcase";
import { PlatformStats } from "./hero/platform-stats";
import { InfrastructurePanel } from "./infrastructure/infrastructure-panel";
import { LiveBroadcast } from "./live/live-broadcast";
import { LiveFeeds } from "./live/live-feeds";
import { DesktopFooter } from "./shell/desktop-footer";
import { DesktopHeader } from "./shell/desktop-header";

/** Desktop Arena hub (Stitch: "Dota 2 & CS2 Esports Tournament Platform"). */
export function ArenaDesktop({ data }: { data: ArenaDesktopData }) {
  const { shell, hero, arenas, live, infrastructure } = data;

  return (
    <FeaturedGameProvider initial={hero.events[0].game}>
      <DesktopHeader shell={shell} />
      <main className="w-full bg-canvas-base pt-20">
        <div className="relative w-full overflow-hidden">
          <AmbientGlows />
          <div className="relative z-10 flex w-full flex-col gap-space-xl px-margin-desktop py-space-lg">
            <section className="flex flex-col gap-space-md">
              <HeroShowcase events={hero.events} telemetry={hero.telemetry} />
              <PlatformStats stats={hero.stats} />
            </section>
            <ArenaDiscovery
              section={arenas.section}
              filters={arenas.filters}
              chips={arenas.chips}
              cards={arenas.cards}
            />
            <section className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
              <LiveBroadcast broadcast={live.broadcast} />
              <LiveFeeds matches={live.feeds} />
            </section>
            <InfrastructurePanel data={infrastructure} />
          </div>
        </div>
      </main>
      <DesktopFooter shell={shell} />
    </FeaturedGameProvider>
  );
}

function AmbientGlows() {
  return (
    <>
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[350px] w-[600px] rounded-full bg-primary-container/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-64 right-10 h-[400px] w-[500px] rounded-full bg-secondary-container/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 left-10 h-[300px] w-[450px] rounded-full bg-tertiary-container/10 blur-[120px]" />
    </>
  );
}
