import type { ItemMobile as ItemMobileData } from "../../mobile.types";
import { FloorPriceCard } from "./floor-price-card";
import { HeroShowcase } from "./hero-showcase";
import { InspectorActionRow } from "./inspector-action-row";
import { InspectorHeader } from "./inspector-header";
import { InstantActions } from "./instant-actions";
import { MetaPanel } from "./meta-panel";
import { SellerList } from "./seller-list";
import { StyleMatrix } from "./style-matrix";
import { SynergyRail } from "./synergy-rail";

/** Mobile item inspector (Stitch: "Lootora Mobile — Item Detail: PA Manifold Paradox"). */
export function ItemMobile({ item }: { item: ItemMobileData }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas-base font-body-md text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <InspectorHeader />
      <main className="pb-safe flex w-full flex-1 flex-col bg-canvas-base pt-16">
        <div className="flex w-full flex-col text-on-surface">
          <InspectorActionRow item={item} />
          <HeroShowcase item={item} />
          <StyleMatrix item={item} />
          <FloorPriceCard item={item} />
          <InstantActions item={item} />
          <MetaPanel meta={item.meta} />
          <SellerList item={item} />
          <SynergyRail item={item} />
        </div>
      </main>
    </div>
  );
}
