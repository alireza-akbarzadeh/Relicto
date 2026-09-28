import type { Metadata } from "next";
import { requireSession } from "@/modules/relicto/data/get-session";

/** Private to one trader: nothing here belongs in a search index. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Account-only screens (orders, wallet, sell studio, tracker board, alerts,
 * checkout, profile). The proxy bounces guests on the cookie alone; this is
 * the authoritative session check.
 */
export default async function AccountLayout({ children }: LayoutProps<"/">) {
  await requireSession();
  return children;
}
