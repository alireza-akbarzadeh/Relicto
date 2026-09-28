import type { Metadata } from "next";
import { ArenaDesktop } from "@/modules/tournaments/components/desktop/arena-desktop";
import { ArenaMobile } from "@/modules/tournaments/components/mobile/arena-mobile";
import { getArenaDesktop, getArenaMobile } from "@/modules/tournaments/data/get-arena";
import { pageMetadata } from "@/modules/seo/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Dota 2 & CS2 Tournaments — Brackets & Live Matches",
  description: "Follow Dota 2 and CS2 tournaments on Relicto: live brackets, prize pools, match feeds and the pro loadouts moving item prices.",
  path: "/tournaments",
});

/**
 * The design ships separate mobile and desktop compositions; both render and
 * CSS picks one at the `md` breakpoint, so there's no layout shift or UA sniffing.
 */
export default async function TournamentsPage() {
  const [desktop, mobile] = await Promise.all([getArenaDesktop(), getArenaMobile()]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container md:bg-canvas-base">
      <div className="md:hidden">
        <ArenaMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <ArenaDesktop data={desktop} />
      </div>
    </div>
  );
}
