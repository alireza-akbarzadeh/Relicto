"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { syncSteamInventory } from "../actions/inventory";

const REFUSED: Record<string, readonly [string, string]> = {
  private: [
    "Your Steam inventory is private",
    "Set Inventory to Public in Steam › Edit Profile › Privacy Settings, then sync again.",
  ],
  "rate-limited": [
    "Steam is rate-limiting us",
    "Give it a minute and sync again.",
  ],
  unavailable: [
    "Steam didn't answer",
    "Its inventory service may be down. Try again shortly.",
  ],
  throttled: ["Synced moments ago", "You can pull again in a minute."],
  "no-steam": [
    "No Steam account linked",
    "Sign in through Steam to mirror your inventory here.",
  ],
};

const GAME: Record<string, string> = {
  cs2: "CS2",
  dota2: "Dota 2",
  tf2: "TF2",
};

/** The studio's Sync button: pull the Steam inventory now and say what happened. */
export function useSteamSync() {
  const [pending, startTransition] = useTransition();

  const sync = () =>
    startTransition(async () => {
      try {
        const result = await syncSteamInventory();
        if (result.status === "ok") {
          const partial = result.skipped.length
            ? ` Steam skipped ${result.skipped.map((id) => GAME[id] ?? id).join(", ")} — sync again in a minute.`
            : "";
          toast.success("Steam inventory synced", {
            description: `${result.itemCount} marketable item${result.itemCount === 1 ? "" : "s"}${result.cancelled ? ` · ${result.cancelled} listing${result.cancelled === 1 ? "" : "s"} closed (item left Steam)` : ""}.${partial}`,
          });
        } else {
          const [title, description] = REFUSED[result.status];
          toast.error(title, { description });
        }
      } catch {
        toast.error("Couldn't reach Steam", {
          description: "Check your connection and try again.",
        });
      }
    });

  return { pending, sync };
}
