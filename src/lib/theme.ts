/**
 * Colour theme: dark (the Stitch default) or light ("Tactical Precision Light").
 * The choice lives on `<html data-theme>` and in localStorage; the inline
 * THEME_SCRIPT applies it before first paint so there is no flash.
 */
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "relicto-theme";
const THEME_EVENT = "relicto-theme-change";

/** Runs in <head> before React: restores the saved theme (dark by default). */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** useSyncExternalStore subscription: this tab's changes and other tabs' storage events. */
export function subscribeTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    document.documentElement.dataset.theme = event.newValue === "light" ? "light" : "dark";
    onChange();
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
