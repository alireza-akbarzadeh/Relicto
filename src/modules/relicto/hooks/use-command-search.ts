"use client";

import type { KeyboardEvent } from "react";
import { useSearchDialog } from "@/modules/search/state/search-provider";

/**
 * Turns a header's search field into the command palette's trigger. The
 * field keeps its design but never holds text itself: a click, Enter, or the
 * first typed character opens the palette (carrying that character over).
 * Not on focus — the dialog hands focus back to the field when it closes,
 * which would reopen it. The ⌘K and "/" hotkeys live in `SearchProvider`.
 */
export function useCommandSearch() {
  const { open } = useSearchDialog();

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    } else if (event.key.length === 1) {
      event.preventDefault();
      open(event.key);
    }
  };

  return {
    // The whole field opens the palette: some headers squeeze the input down to
    // its icon and hotkey badge, leaving nothing of the input itself to click.
    trigger: { onClick: () => open() },
    input: {
      readOnly: true,
      onKeyDown,
      type: "text" as const,
      role: "combobox" as const,
      "aria-haspopup": "dialog" as const,
      "aria-expanded": false,
      "aria-label": "Search items, traders and tournaments",
    },
  };
}
