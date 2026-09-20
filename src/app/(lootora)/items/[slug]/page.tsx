import type { Metadata } from "next";
import { ItemView } from "@/modules/items/components/item-view";
import { getItem } from "@/modules/items/data/get-item";
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
  const item = await getItem(slug);
  if (!item) {
    return <NotFoundView variant="item" route={`relicto.gg/items/${slug}`} />;
  }
  return <ItemView item={item} />;
}
