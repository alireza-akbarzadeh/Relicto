import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const media = window.matchMedia(query);
    
    if (media.addEventListener) {
      media.addEventListener("change", callback);
    } else {
      media.addListener(callback);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", callback);
      } else {
        media.removeListener(callback);
      }
    };
  };

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}