"use client"
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Icon } from "@/components/ui/icon";
import { STUDIO_NAV } from "../../data/navigation";
import { UserMenu } from "../account/user-menu";
import { NotificationsMenu } from "../notifications/notifications-menu";
import { MarketBrand } from "./brand";
import { CartButton } from "../cart/cart-button";
import { StudioHeaderSearch } from "./header-search";
import { MainNav } from "./main-nav";
import { WalletChip } from "./wallet-chip";
import { SheetContent, SheetTrigger ,Sheet} from "@/components/ui/sheet";

export function StudioHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface-overlay shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="flex h-16 sm:h-20 w-full items-center justify-between gap-2 md:gap-space-md px-4 md:px-margin-desktop">
        {/* Left Section: Mobile Nav Trigger + Brand + Desktop Nav */}
        <div className="flex shrink-0 items-center gap-3 md:gap-space-lg">
          {/* Mobile Drawer Navigation Trigger (< xl) */}
          <div className="xl:hidden">
            <Sheet>
              <SheetTrigger
                render={(props) => (
                  <button
                    {...props}
                    type="button"
                    aria-label="Toggle navigation menu"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface-container-low text-text-secondary transition-colors hover:bg-surface-container-high hover:text-text-primary active:scale-95"
                  >
                    <Icon name="menu" className="text-[20px]" />
                  </button>
                )}
              />
              <SheetContent  className="bg-surface-card border-t border-white/10 p-4">
                <div className="flex flex-col gap-4">
                  <span className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Studio Navigation
                  </span>

                  <nav className="flex flex-col gap-1">
                    {STUDIO_NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary active:scale-[0.98]"
                      >
                        {item.icon && (
                          <Icon name={item.icon} className="text-[18px] text-text-muted" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>

                  <hr className="border-white/5" />

                  {/* Mobile Quick Actions */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-text-muted">Appearance</span>
                    <ThemeToggle className="bg-surface-container-low p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <MarketBrand />

          {/* Desktop Navigation Link Bar (>= xl) */}
          <nav className="hidden items-center gap-space-xs xl:flex">
            <MainNav />
          </nav>
        </div>

        {/* Right Section: Search & User Controls */}
        <div className="flex max-w-2xl flex-1 items-center justify-end gap-2 md:gap-space-md">
          <div className="hidden sm:block flex-1 max-w-xs">
            <StudioHeaderSearch />
          </div>

          <WalletChip />

          <div className="hidden sm:flex items-center gap-2">
            <CartButton />
          </div>

          <NotificationsMenu trigger="square" />
          <UserMenu trigger="studio" />
        </div>
      </div>
    </header>
  );
}