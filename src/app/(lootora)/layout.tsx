import { requireSession } from "@/modules/relicto/data/get-session";
import { SessionProvider } from "@/modules/relicto/state/session-provider";
import { CartProvider } from "@/modules/relicto/state/cart-provider";
import { WatchlistProvider } from "@/modules/relicto/state/watchlist-provider";
import { getWatchedSlugs } from "@/modules/relicto/data/get-watchlist";
import { getCartLines } from "@/modules/checkout/data/get-checkout";
import {TooltipProvider} from "@/components/ui/tooltip";

/** Signed-in Relicto app: shares the session (user, notifications), the live basket and the watchlist across pages. */
export default async function RelictoLayout({ children }: LayoutProps<"/">) {
  const [{ user, notifications }, cart, watched] = await Promise.all([requireSession(), getCartLines(), getWatchedSlugs()]);
  return (
    <SessionProvider user={user} notifications={notifications}>
      <CartProvider initialItems={cart}>
        <WatchlistProvider initialSlugs={watched}>
          <TooltipProvider>{children}</TooltipProvider>
        </WatchlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
