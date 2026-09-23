"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { setWatched } from "../actions/watchlist";

/**
 * The trader's watched item slugs, shared by every heart and watch button.
 * Optimistic; the server's answer replaces the set, and a failure rolls back.
 */
export function useWatchlistState(initial: string[]) {
  const [slugs, setSlugs] = useState(() => new Set(initial));

  const isWatched = useCallback((slug: string) => slugs.has(slug), [slugs]);

  const toggle = useCallback(
    (slug: string, name: string) => {
      const watched = !slugs.has(slug);
      const before = slugs;
      setSlugs((current) => {
        const next = new Set(current);
        if (watched) next.add(slug);
        else next.delete(slug);
        return next;
      });

      if (watched) toast.success(`Watching ${name}`, { description: "It's on your tracker board. Set a price alert to get pinged." });
      else toast(`Removed ${name} from your watchlist`);

      setWatched({ slug, watched })
        .then((result) => {
          if (!result.known) toast(`${name} isn't in the Relicto catalog yet`, { description: "It can't be watched until it's listed." });
          setSlugs(new Set(result.slugs));
        })
        .catch(() => {
          setSlugs(before);
          toast.error("Couldn't update your watchlist", { description: "Check your connection and try again." });
        });
    },
    [slugs],
  );

  return useMemo(() => ({ isWatched, toggle }), [isWatched, toggle]);
}
