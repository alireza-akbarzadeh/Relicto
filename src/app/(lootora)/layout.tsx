import { getSession } from "@/modules/relicto/data/get-session";
import { SessionProvider } from "@/modules/relicto/state/session-provider";
import { CartProvider } from "@/modules/relicto/state/cart-provider";
import { WatchlistProvider } from "@/modules/relicto/state/watchlist-provider";
import { getWatchedSlugs } from "@/modules/relicto/data/get-watchlist";
import { getCartLines } from "@/modules/checkout/data/get-checkout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchProvider } from "@/modules/search/state/search-provider";
import { CopilotDock } from "@/modules/copilot/components/copilot-dock";
import { BroadcastBanner } from "@/modules/relicto/components/shell/broadcast-banner";
import { settingsService } from "@/server/modules/settings/settings.service";

/**
 * Relicto app shell: shares the session (user, notifications), the live basket,
 * the watchlist and the search palette across pages. Guests browse the public
 * catalog with an empty basket and watchlist; `(account)` pages require a session.
 */
export default async function RelictoLayout({ children }: LayoutProps<"/">) {
  const [session, settings] = await Promise.all([
    getSession(),
    settingsService.getSettings(),
  ]);
  const [cart, watched] = session ? await Promise.all([getCartLines(), getWatchedSlugs()]) : [[], []];
  return (
    <SessionProvider user={session?.user ?? null} notifications={session?.notifications ?? []}>
      <CartProvider initialItems={cart}>
        <WatchlistProvider initialSlugs={watched}>
          <TooltipProvider>
            <SearchProvider>
              <BroadcastBanner settings={settings} />
              {children}
              <CopilotDock />
            </SearchProvider>
          </TooltipProvider>
        </WatchlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
