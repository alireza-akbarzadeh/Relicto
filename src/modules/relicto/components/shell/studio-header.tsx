import { STUDIO_NAV } from "../../data/navigation";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { StudioBrand } from "./brand";
import { StudioHeaderSearch } from "./header-search";
import { NavLinks } from "./nav-link";
import { WalletChip } from "./wallet-chip";

/** Header of the sell studio and wallet screens. */
export function StudioHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface-overlay shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-space-md px-margin-desktop">
        <div className="flex shrink-0 items-center gap-space-lg">
          <StudioBrand />
          <nav className="hidden items-center gap-space-xs xl:flex">
            <NavLinks items={STUDIO_NAV} variant="studio" />
          </nav>
        </div>
        <div className="flex max-w-2xl flex-1 items-center justify-end gap-space-md">
          <StudioHeaderSearch />
          <WalletChip variant="studio" />
          <NotificationsMenu trigger="square" />
          <UserMenu trigger="studio" />
        </div>
      </div>
    </header>
  );
}
