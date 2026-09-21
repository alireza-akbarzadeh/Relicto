import { UserMenu } from "@/modules/relicto/components/account/user-menu";
import { MobileBackButton } from "@/modules/relicto/components/mobile/mobile-back-button";

/** Mobile top bar of the item page: back, title, account. */
export function InspectorHeader() {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-deep/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-space-sm px-space-md">
        <div className="flex items-center gap-space-sm">
          <MobileBackButton fallback="/marketplace" className="rounded-lg bg-surface-card/60 text-text-secondary hover:text-text-primary" />
          <h1 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">Item Inspector</h1>
        </div>
        <div className="flex items-center gap-space-sm">
          <UserMenu trigger="mobile" />
        </div>
      </div>
    </header>
  );
}
