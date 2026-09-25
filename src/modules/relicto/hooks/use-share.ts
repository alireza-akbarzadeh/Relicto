"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export type ShareTarget = { title: string; text?: string; path: string };

/** `navigator.share` is only present on secure origins, and not in every browser. */
const canNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

async function copy(url: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }
  /* Older Safari and any non-secure origin: fall back to a hidden selection. */
  const field = document.createElement("textarea");
  field.value = url;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  document.body.removeChild(field);
}

/**
 * Shares a link to something in the app: the OS share sheet where the browser
 * offers one, otherwise the link on the clipboard.
 *
 * A dismissed share sheet reports as `AbortError` — that's the person changing
 * their mind, not a failure, so it passes silently.
 */
export function useShare() {
  const [justCopied, setJustCopied] = useState(false);

  const share = useCallback(async ({ title, text, path }: ShareTarget) => {
    const url = new URL(path, window.location.origin).toString();

    if (canNativeShare()) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
        /* Sheet unavailable or refused — the clipboard still works. */
      }
    }

    try {
      await copy(url);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
      toast.success("Link copied", { description: title });
    } catch {
      toast.error("Couldn't copy the link", { description: url });
    }
  }, []);

  return { share, justCopied };
}
