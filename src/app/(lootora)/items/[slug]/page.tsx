import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemView } from "@/modules/items/components/item-view";
import { ItemMobile } from "@/modules/items/components/mobile/item-mobile";
import { getItem, getItemMobile } from "@/modules/items/data/get-item";
import { getItemSeo } from "@/modules/items/data/get-item-seo";
import { itemJsonLd, itemMetadata, itemPath } from "@/modules/items/lib/item-seo";
import { JsonLd } from "@/modules/seo/components/json-ld";
import { pageMetadata } from "@/modules/seo/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/items/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getItemSeo(slug);
  if (seo) return itemMetadata(seo);

  // An authored page the catalog doesn't carry: readable, but not a market to index.
  const item = await getItem(slug);
  if (!item) notFound();
  return pageMetadata({ title: item.name, description: item.description, path: itemPath(slug), index: false });
}

export default async function ItemPage({ params }: PageProps<"/items/[slug]">) {
  const { slug } = await params;
  const [item, mobile, seo] = await Promise.all([getItem(slug), getItemMobile(slug), getItemSeo(slug)]);
  if (!item) notFound();

  const structured = seo && <JsonLd data={itemJsonLd(seo)} />;
  if (!mobile) {
    return (
      <>
        {structured}
        <ItemView item={item} />
      </>
    );
  }
  /** Separate mobile and desktop compositions; CSS picks one at `md`. */
  return (
    <>
      {structured}
      <div className="md:hidden">
        <ItemMobile item={mobile} />
      </div>
      <div className="hidden md:block">
        <ItemView item={item} />
      </div>
    </>
  );
}
