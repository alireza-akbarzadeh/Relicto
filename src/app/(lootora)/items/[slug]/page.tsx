import type { Metadata } from "next";
import { ItemView } from "@/modules/items/components/item-view";
import { ItemMobile } from "@/modules/items/components/mobile/item-mobile";
import { getItem, getItemMobile } from "@/modules/items/data/get-item";
import { NotFoundView } from "@/modules/status/components/not-found-view";

export async function generateMetadata({ params }: PageProps<"/items/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  if (!item) {
    return { title: "Item not found", description: "This listing is not in the Relicto catalog." };
  }
  return { title: item.name, description: item.description };
}

export default async function ItemPage({ params }: PageProps<"/items/[slug]">) {
  const { slug } = await params;
  const [item, mobile] = await Promise.all([getItem(slug), getItemMobile(slug)]);
  if (!item) {
    return <NotFoundView variant="item" route={`relicto.gg/items/${slug}`} />;
  }
  if (!mobile) {
    return <ItemView item={item} />;
  }
  /** Separate mobile and desktop compositions; CSS picks one at `md`. */
  return (
    <>
      <div className="md:hidden">
        <ItemMobile item={mobile} />
      </div>
      <div className="hidden md:block">
        <ItemView item={item} />
      </div>
    </>
  );
}
