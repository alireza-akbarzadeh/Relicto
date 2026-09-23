"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useWatchlist } from "@/modules/relicto/state/watchlist-provider";
import type { ItemMobile } from "../../mobile.types";

const ACTION = "h-9 w-9 rounded-lg border-0 bg-surface-container-low text-text-secondary transition-all active:scale-95";

/** Breadcrumb plus watchlist and share, under the header. */
export function InspectorActionRow({ item }: { item: ItemMobile }) {
  const { isWatched, toggle } = useWatchlist();
  const saved = isWatched(item.slug);
  const toggleSaved = () => toggle(item.slug, item.name);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${item.breadcrumb.hero} — ${item.name}`, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied", { description: "The current style and filters are in the link." });
  };

  return (
    <div className="flex items-center justify-between bg-surface-container-lowest px-space-md py-space-sm">
      <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs truncate font-label-badge text-label-badge text-text-secondary">
        <span className="font-bold tracking-wider text-tertiary">{item.breadcrumb.game}</span>
        <span>/</span>
        <Link href="/wiki" className="transition-colors hover:text-text-primary">
          {item.breadcrumb.section}
        </Link>
        <span>/</span>
        <span className="truncate font-semibold text-text-primary">{item.breadcrumb.hero}</span>
      </nav>
      <div className="flex shrink-0 items-center gap-space-xs">
        <Button variant={null} size={null} aria-label="Add to watchlist" aria-pressed={saved} onClick={toggleSaved} className={ACTION}>
          <Icon name="favorite" filled={saved} className={cn("text-[18px]", saved && "text-primary")} />
        </Button>
        <Button variant={null} size={null} aria-label="Share item" onClick={share} className={ACTION}>
          <Icon name="share" className="text-[18px]" />
        </Button>
      </div>
    </div>
  );
}
