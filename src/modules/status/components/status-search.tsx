"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";

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
        <input
          ref={inputRef}
          type="search"
          placeholder="Search skins, seed numbers, Doppler phases, or tourneys..."
          className="w-full rounded-xl bg-surface-deep py-space-md pr-20 pl-12 font-body-md text-body-md text-on-surface shadow-lg transition-colors placeholder:text-text-muted focus:bg-surface-container focus:outline-none"
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
