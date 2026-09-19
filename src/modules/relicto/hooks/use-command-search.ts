"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent } from "react";

/** Keyboard shortcut that focuses the field: ⌘K / Ctrl+K, or a bare "/" outside other fields. */
export type SearchHotkey = "mod+k" | "slash";

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function matches(event: globalThis.KeyboardEvent, hotkey: SearchHotkey) {
  if (hotkey === "slash") return event.key === "/" && !isTypingTarget(event.target);
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
}

/**
 * The hotkey focuses the field; Enter searches the marketplace.
 * Returns props to spread on the search input.
 */
export function useCommandSearch(hotkey: SearchHotkey = "mod+k") {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (!matches(event, hotkey)) return;
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") event.currentTarget.blur();
    if (event.key !== "Enter") return;
    const query = event.currentTarget.value.trim();
    router.push(query ? `/marketplace?q=${encodeURIComponent(query)}` : "/marketplace");
  };

  return { ref: inputRef, onKeyDown, type: "text" as const, enterKeyHint: "search" as const, "aria-label": "Search the marketplace" };
}
