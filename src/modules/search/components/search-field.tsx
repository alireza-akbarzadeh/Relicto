"use client";

import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const KBD =
  "flex items-center gap-1 rounded bg-surface-container-high px-2 py-1 font-label-badge text-label-badge text-text-secondary shadow-sm";

type SearchFieldProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onClose: () => void;
};

/** The palette's input, with its search glyph (pulsing while a query is in flight) and the key legend. */
export function SearchField({
  value,
  loading,
  onChange,
  onKeyDown,
  onClose,
}: SearchFieldProps) {
  return (
    <div className="relative flex items-center rounded-lg bg-surface-container-lowest/90 px-space-md py-3 shadow-[0_0_24px_rgba(244,63,94,0.12)]">
      <div className="mr-space-sm flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary-container/20 text-primary shadow-[0_0_12px_rgba(244,63,94,0.35)]">
        <Icon
          name="search"
          className={cn("text-[20px]", loading && "animate-pulse")}
        />
      </div>
      <Input
        autoFocus
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        type="search"
        enterKeyHint="search"
        aria-label="Search items, traders and tournaments"
        placeholder="Search skins, Doppler seeds, heroes, traders…"
        className="h-auto flex-1 rounded-none border-0 bg-transparent p-0 font-headline-sm text-headline-sm tracking-tight text-text-primary shadow-none placeholder:text-text-muted/60 focus-visible:ring-0 md:text-headline-sm dark:bg-transparent [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="ml-space-sm hidden shrink-0 items-center gap-1.5 sm:flex">
        <kbd className={KBD}>
          <span>↑↓</span>
          <span className="text-text-muted">NAV</span>
        </kbd>
        <kbd className={KBD}>
          <span>↵</span>
          <span className="text-text-muted">SELECT</span>
        </kbd>
        <Button
          variant={null}
          size={null}
          onClick={onClose}
          className="h-auto rounded border-0 bg-surface-container px-2 py-1 font-label-badge text-label-badge text-text-muted transition-colors hover:bg-surface-container-high hover:text-text-primary"
        >
          ESC
        </Button>
      </div>
    </div>
  );
}
