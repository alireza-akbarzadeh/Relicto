import { LEDGER_NAV } from "../../data/navigation";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { LedgerBrand } from "./brand";
import { LedgerHeaderSearch } from "./header-search";
import { NavLinks } from "./nav-link";
import { WalletChip } from "./wallet-chip";
import { CartButton } from "./cart-button";

/** Header of the orders, order-tracking and profile screens. */
export function LedgerHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-surface-deep/90 shadow-[0_1px_8px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-space-md px-gutter-desktop">
        <div className="flex items-center gap-space-lg">
          <LedgerBrand />
          <nav className="hidden items-center gap-space-xs xl:flex">
            <NavLinks items={LEDGER_NAV} variant="ledger" />
          </nav>
        </div>
        <LedgerHeaderSearch />
        <div className="flex items-center gap-space-md">
          <WalletChip variant="ledger" />
          <CartButton />
          <NotificationsMenu trigger="dot" />
          <UserMenu trigger="ledger" />
        </div>
      </div>
    </header>
  );
}
