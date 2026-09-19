"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent } from "react";

/**
 * ⌘K / Ctrl+K focuses the field; Enter searches the marketplace.
 * Returns props to spread on the search `<input>`.
 */
export function useCommandSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") event.currentTarget.blur();
    if (event.key !== "Enter") return;
    const query = event.currentTarget.value.trim();
    router.push(query ? `/marketplace?q=${encodeURIComponent(query)}` : "/marketplace");
  };

  return { ref: inputRef, onKeyDown, type: "text" as const, enterKeyHint: "search" as const, "aria-label": "Search the marketplace" };
}
