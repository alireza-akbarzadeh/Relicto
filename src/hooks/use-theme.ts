"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, readTheme, subscribeTheme, type Theme } from "@/lib/theme";

/** Current colour theme and setters. The server always renders "dark"; the client catches up after hydration. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => "dark");
  return {
    theme,
    setTheme: applyTheme,
    toggle: () => applyTheme(theme === "light" ? "dark" : "light"),
  };
}
