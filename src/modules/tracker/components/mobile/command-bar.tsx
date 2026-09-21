"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { useDopplerPhase } from "../../hooks/use-doppler-phase";
import type { TrackerMobileData } from "../../mobile.types";

/** Thumb-zone actions: take the lowest ask into checkout, or set a limit bid alert. */
export function CommandBar({ data }: { data: TrackerMobileData }) {
  const router = useRouter();
  const { items, addItem } = useCart();
  const { active } = useDopplerPhase(data.phases, data.defaultPhase);
  const { asset } = data;

  const snag = () => {
    const id = `${asset.slug}-${active.id}`;
    if (!items.some((line) => line.id === id)) {
      addItem({
        id,
        image: asset.image,
        imageAlt: asset.imageAlt,
        badge: "Covert ★",
        badgeTone: "bg-status-live text-text-primary",
        game: "CS2 Elite",
        gameTone: "text-tertiary",
        name: `${asset.name} | Doppler`,
        detail: `${active.label} • ${asset.wear} • Float: ${asset.float}`,
        intel: ["Vendor: Floor (Relicto)"],
        bot: "Sentinel Bot #09",
        price: active.priceUsd,
        marker: `FN ${asset.float.slice(0, 6)}`,
        markerTone: "text-status-upcoming",
      });
    }
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      <Button
        variant={null}
        size={null}
        onClick={snag}
        className="col-span-2 h-auto min-h-[48px] gap-2 rounded-xl border-0 bg-primary-container px-4 py-3 font-headline-sm text-headline-sm font-bold tracking-wider text-on-primary-container uppercase shadow-lg shadow-primary-container/20 transition-transform active:scale-[0.98]"
      >
        <Icon name="bolt" className="text-[20px]" />
        <span className="truncate">Snag Lowest Ask {formatMoney(active.priceUsd, { whole: true })}</span>
      </Button>
      <LinkButton
        href="/alerts"
        className="col-span-1 h-auto min-h-[48px] gap-1 rounded-xl border-0 bg-surface-container-high px-3 py-3 font-label-caps text-label-caps font-bold text-text-primary uppercase transition-transform active:scale-[0.98]"
      >
        <Icon name="add_task" className="text-[18px]" />
        <span>Limit Bid</span>
      </LinkButton>
    </div>
  );
}
