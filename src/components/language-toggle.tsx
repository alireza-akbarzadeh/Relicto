"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { setLocaleAction } from "@/modules/i18n/actions";

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "fa" ? "en" : "fa";
    startTransition(async () => {
      await setLocaleAction(nextLocale);
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={toggleLanguage}
      aria-label="Toggle Language (English / Persian)"
      className={cn(
        "h-9 gap-1.5 rounded-lg border-white/10 bg-surface-container-low px-2.5 font-data-mono-md text-xs font-semibold text-text-secondary transition-all hover:border-white/20 hover:bg-surface-container-high hover:text-text-primary active:scale-95",
        pending && "opacity-60",
        className,
      )}
    >
      <Icon name="public" className="text-[16px] text-tertiary" />
      <span className="uppercase">{locale === "fa" ? "FA (فارسی)" : "EN"}</span>
    </Button>
  );
}
