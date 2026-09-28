"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { signInHref } from "../../lib/sign-in-href";

const BASE =
  "h-9 gap-1.5 rounded-xl px-3 font-headline-sm text-[12px] font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 md:h-10";

/**
 * What a guest sees where the signed-in header shows wallet, basket, bell and
 * avatar: sign in, plus create account from `sm` up. Both return the guest to
 * the page they were reading.
 */
export function GuestActions() {
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <LinkButton
        href={signInHref(pathname)}
        className={cn(
          BASE,
          "border border-border-subtle bg-surface-container-low text-text-primary hover:border-tertiary/40 hover:bg-surface-container-high",
        )}
      >
        <Icon name="login" className="text-[16px] text-tertiary" />
        Sign in
      </LinkButton>
      <LinkButton
        href={signInHref(pathname, "/sign-up")}
        className={cn(
          BASE,
          "hidden bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:bg-primary hover:text-on-primary sm:inline-flex",
        )}
      >
        <Icon name="person_add" className="text-[16px]" />
        Create account
      </LinkButton>
    </div>
  );
}
