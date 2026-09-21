import { Icon } from "@/components/ui/icon";
import { MobileBackButton } from "@/modules/relicto/components/mobile/mobile-back-button";

/** Signed-out mobile top bar: back, Relicto / section, hub chip and an anonymous avatar. */
export function AuthMobileHeader({ section }: { section: string }) {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface-deep/90 shadow-[0_1px_8px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-space-md">
        <div className="flex items-center gap-space-sm">
          <MobileBackButton fallback="/" icon="arrow_back_ios_new" iconClassName="text-[24px]" className="rounded-none text-text-secondary hover:text-on-surface" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-primary-container uppercase">Relicto</span>
            <h1 className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">{section}</h1>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="rounded bg-surface-container-high px-2 py-1 font-label-badge text-label-badge text-tertiary uppercase">TACTICAL HUB</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary" aria-hidden>
            <Icon name="person" className="text-[18px] text-on-primary" />
          </span>
        </div>
      </div>
    </header>
  );
}
