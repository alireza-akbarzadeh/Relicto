import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { MobileBackButton } from "@/modules/relicto/components/mobile/mobile-back-button";

const ACTION = "h-11 w-11 rounded border-0 text-on-surface-variant transition-colors hover:text-on-surface";

/** Compact titled top bar of the verification screen. */
export function VerifyMobileHeader() {
  return (
    <header className="pt-safe fixed top-0 z-50 w-full bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-space-xs px-space-sm">
        <div className="flex min-w-0 flex-1 items-center gap-space-xs">
          <MobileBackButton fallback="/sign-in" className="rounded text-on-surface hover:text-text-primary" />
          <h1 className="truncate font-headline-sm text-headline-sm font-semibold tracking-tight text-text-primary">Steam Guard 2FA Verification</h1>
        </div>
        <div className="flex items-center gap-1">
          <NoticeButton aria-label="Trust this device" notice={{ title: "Trusted device", description: "Relicto skips the push challenge on this phone for 30 days." }} className={ACTION}>
            <Icon name="favorite" className="text-[20px]" />
          </NoticeButton>
          <NoticeButton aria-label="Security help" notice={{ title: "Steam Guard help", description: "Codes rotate every 30 seconds in the Steam Mobile app." }} className={ACTION}>
            <Icon name="share" className="text-[20px]" />
          </NoticeButton>
          <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary" aria-hidden>
            <Icon name="person" className="text-[18px] text-on-primary" />
          </span>
        </div>
      </div>
    </header>
  );
}
