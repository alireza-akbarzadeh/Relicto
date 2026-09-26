"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SearchDialog } from "../components/search-dialog";

type SearchPalette = { open: (query?: string) => void };

const SearchContext = createContext<SearchPalette | null>(null);

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

/**
 * One command palette for the whole signed-in app. Every header's search
 * field opens it, as do ⌘K / Ctrl+K anywhere and "/" outside other fields.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  // Bumped per opening, so the palette body remounts and starts from the header's text.
  const [session, setSession] = useState(0);

  const open = useCallback((query = "") => {
    setInitialQuery(query);
    setSession((count) => count + 1);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const modK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !isTypingTarget(event.target);
      if (!modK && !slash) return;
      event.preventDefault();
      open();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog
        open={isOpen}
        session={session}
        initialQuery={initialQuery}
        onOpenChange={setOpen}
      />
    </SearchContext.Provider>
  );
}

export function useSearchDialog() {
  const palette = useContext(SearchContext);
  if (!palette)
    throw new Error("useSearchDialog must be used inside <SearchProvider>.");
  return palette;
}
