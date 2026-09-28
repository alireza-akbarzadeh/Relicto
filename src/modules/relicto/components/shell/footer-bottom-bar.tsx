"use client";

import { ArrowUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/site";

const CONTROL =
  "flex h-8 items-center gap-1.5 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2.5 font-label-badge text-[11px] text-text-secondary hover:bg-surface-container-high hover:text-text-primary";

/** Copyright, the Valve trademark notice, and two working controls: theme and back to top. */
export function FooterBottomBar() {
  const scrollTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="border-t border-outline-variant/15 bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-space-sm px-4 py-space-md md:flex-row md:items-center md:justify-between md:px-margin-desktop">
        <p className="max-w-3xl font-body-sm text-[11px] leading-relaxed text-text-muted">
          © {new Date().getFullYear()} {SITE_NAME}. An independent marketplace, not affiliated with or endorsed by Valve Corporation. Steam,
          Counter-Strike and Dota 2 are trademarks of Valve Corporation.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className={CONTROL} iconClassName="text-[15px]" />
          <Button variant={null} size={null} onClick={scrollTop} className={CONTROL}>
            <ArrowUp className="size-3.5" />
            Back to top
          </Button>
        </div>
      </div>
    </div>
  );
}
