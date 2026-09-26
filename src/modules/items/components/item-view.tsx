import { VaultFooter } from "@/modules/relicto/components/shell/vault-footer";
import { VaultHeader } from "@/modules/relicto/components/shell/vault-header";
import type { ItemDetail } from "../types";
import { BreadcrumbBar } from "./detail/breadcrumb-bar";
import { ItemViewer } from "./detail/item-viewer";
import { PricePanel } from "./detail/price-panel";
import { SectionNav } from "./detail/section-nav";
import { StyleProgression } from "./detail/style-progression";
import { PriceChart } from "./intelligence/price-chart";
import { OffersSection } from "./offers/offers-section";
import { RelatedItems } from "./related/related-items";
import { EngineMods } from "./specs/engine-mods";
import { RevenueConvertor } from "./specs/revenue-convertor";
import { VfxReplay } from "./specs/vfx-replay";

/** Stitch: "Relicto — Item Detail: Phantom Assassin Manifold Paradox". */
export function ItemView({ item }: { item: ItemDetail }) {
  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <VaultHeader steamId="765611980823488234" />
      <main className="w-full bg-canvas-base pt-20">
        <BreadcrumbBar item={item} />
        <section
          id="overview"
          className="relative w-full scroll-mt-40 overflow-hidden bg-linear-to-b/srgb from-surface-container-lowest via-surface-deep to-canvas-base px-4 py-8 lg:px-8"
        >
          <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-status-upcoming/10 blur-3xl" />
          <div className="pointer-events-none absolute top-48 right-10 h-80 w-80 rounded-full bg-glow-crimson blur-3xl" />
          <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-6">
              <ItemViewer item={item} />
              {/* Most of the catalog has no authored styles; the panel is only about them. */}
              {item.styles.length > 0 && <StyleProgression styles={item.styles} unlocked={item.stylesUnlocked} />}
            </div>
            <PricePanel item={item} />
          </div>
        </section>
        <SectionNav sections={item.sections} />
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-10 lg:px-8">
          <OffersSection item={item} />
          <PriceChart data={item.intelligence} />
          <RevenueConvertor item={item.name} sell={item.sell} />
          <section id="lore-specs" className="grid w-full scroll-mt-40 grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Catalog-built items have no authored spec sheet or lore; skip the empty card. */}
            {(item.mods.items.length > 0 || item.mods.lore.quote) && <EngineMods mods={item.mods} />}
            <VfxReplay replay={item.replay} itemName={item.name} />
          </section>
          <RelatedItems related={item.related} />
        </div>
      </main>
      <VaultFooter />
    </div>
  );
}
