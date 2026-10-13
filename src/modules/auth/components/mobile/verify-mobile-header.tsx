"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MobileBackButton } from "@/modules/relicto/components/mobile/mobile-back-button";

const ACTION = "flex h-11 w-11 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-hidden";

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
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={() => toast.success("Device trusted for 30 days", { description: "Steam Guard push challenge remembered on this client." })}
            aria-label="Trust this device"
            className={ACTION}
          >
            <Icon name="favorite" className="text-[20px]" />
          </Button>
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={() => toast.info("Steam Guard security assistance", { description: "Open Steam Mobile app on your phone and tap Steam Guard to view code." })}
            aria-label="Security help"
            className={ACTION}
          >
            <Icon name="share" className="text-[20px]" />
          </Button>
          <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary" aria-hidden>
            <Icon name="person" className="text-[18px] text-on-primary" />
          </span>
        </div>
      </div>
    </header>
  );
}
