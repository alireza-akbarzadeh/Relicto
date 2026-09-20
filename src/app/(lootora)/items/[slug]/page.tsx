import type { Metadata } from "next";
import { ItemView } from "@/modules/items/components/item-view";
import { getItem } from "@/modules/items/data/get-item";

export async function generateMetadata({ params }: PageProps<"/items/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItem(slug);
  return { title: item.name, description: item.description };
}

export default async function ItemPage({ params }: PageProps<"/items/[slug]">) {
  const { slug } = await params;
  const item = await getItem(slug);
  return <ItemView item={item} />;
}
