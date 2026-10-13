"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

/** Marketplace search shortcut from the Stitch 404 diagnostic screen. */
export function StatusSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative mt-space-lg w-full max-w-xl">
      <div className="relative flex items-center">
        <Icon name="search" className="pointer-events-none absolute left-space-md text-xl text-text-muted" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search skins, seed numbers, Doppler phases, or tourneys..."
          className="h-auto w-full rounded-xl border-0 bg-surface-deep py-space-md pr-20 pl-12 font-body-md text-body-md text-on-surface shadow-lg transition-colors placeholder:text-text-muted focus-visible:bg-surface-container focus-visible:ring-0"
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            const query = event.currentTarget.value.trim();
            if (!query) return;
            router.push(`/marketplace?q=${encodeURIComponent(query)}`);
          }}
        />
        <div className="pointer-events-none absolute right-space-md flex items-center gap-1 rounded bg-surface-bright px-space-xs py-0.5 font-data-mono-md text-label-badge text-text-muted">
          <span>PRESS</span>
          <kbd className="font-bold text-on-surface">/</kbd>
        </div>
      </div>
    </div>
  );
}
