import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { HubBrand } from "./brand";
import { HubHeaderSearch } from "./header-search";
import { MainNav } from "./main-nav";
import { WalletChip } from "./wallet-chip";
import { CartButton } from "../cart/cart-button";

/** Header of the game hub (home). */
export function HubHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-dark bg-surface/95 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <HubBrand />
          <nav className="hidden items-center gap-1 text-xs font-semibold xl:flex">
            <MainNav />
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <HubHeaderSearch />
          <WalletChip  />
          <CartButton />
          <ThemeToggle className="rounded-md border border-border-dark bg-surface-card p-2 text-text-secondary hover:border-surface-bright hover:text-white" iconClassName="text-[16px]" />
          <NotificationsMenu trigger="hub" />
          <UserMenu trigger="hub" />
        </div>
      </div>
    </header>
  );
}
