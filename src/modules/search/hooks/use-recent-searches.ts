"use client";

import { useCallback, useState } from "react";

const KEY = "relicto.recent-searches";
const KEEP = 6;

/** Browser storage can be blocked or throw (private windows); recents are a convenience, so fail quietly. */
function read(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed
          .filter((entry): entry is string => typeof entry === "string")
          .slice(0, KEEP)
      : [];
  } catch {
    return [];
  }
}

function write(entries: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable — recents just won't persist */
  }
}

/** This browser's last few searches, newest first. Private to the viewer; never sent to the server. */
export function useRecentSearches() {
  const [entries, setEntries] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : read(),
  );

  const remember = useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setEntries((current) => {
      const next = [
        trimmed,
        ...current.filter(
          (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
        ),
      ].slice(0, KEEP);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    write([]);
    setEntries([]);
  }, []);

  return { entries, remember, clear };
}
