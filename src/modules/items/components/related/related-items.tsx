import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { BADGE_WEIGHT, RARITY } from "../../lib/tones";
import type { ItemDetail } from "../../types";

/** Cosmetics frequently equipped alongside this item. */
export function RelatedItems({ related }: { related: ItemDetail["related"] }) {
  return (
    <section id="related" className="flex w-full scroll-mt-40 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-label-caps text-xs font-bold tracking-wider text-tertiary">{related.eyebrow}</span>
          <h3 className="mt-0.5 font-headline-lg text-2xl font-bold text-text-primary">{related.title}</h3>
        </div>
        <NoticeButton
          notice={{ title: "All Phantom Assassin gear", description: "Hero collections open with the catalog API." }}
          className="inline-flex h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-xs font-bold text-text-muted transition-colors hover:text-tertiary"
        >
          <span>ALL PHANTOM ASSASSIN GEAR</span>
          <Icon name="arrow_forward" className="text-[16px]" />
        </NoticeButton>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {related.items.map((entry) => (
          <article
            key={entry.id}
            className="group flex flex-col justify-between overflow-hidden rounded-lg border border-border-subtle bg-surface-card p-4 shadow-lg transition-all hover:border-border-tactical"
          >
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded border border-border-subtle bg-surface-container-lowest">
              <Image
                src={entry.image}
                alt={entry.imageAlt}
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className={cn("absolute top-2 left-2 rounded px-2 py-0.5", RARITY[entry.badge.variant], BADGE_WEIGHT[entry.badge.variant])}>
                {entry.badge.label}
              </span>
            </div>
            <div>
              <span className="font-label-badge text-[10px] text-text-muted uppercase">{entry.kicker}</span>
              <h4 className="mt-0.5 font-headline-sm text-sm font-bold text-text-primary">{entry.name}</h4>
              <p className="mt-1 font-body-sm text-[11px] leading-relaxed text-text-muted">{entry.blurb}</p>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border-subtle/40 pt-4">
              <div className="flex flex-col">
                <span className="font-label-badge text-[10px] text-text-muted">Floor Price</span>
                <span className="font-data-mono-md text-base font-bold text-text-primary">{formatMoney(entry.floorUsd)}</span>
              </div>
              <LinkButton
                href={`/items/${entry.slug}`}
                className="rounded border-border-subtle bg-surface-container px-3 py-1.5 font-label-caps text-xs font-bold text-text-primary transition-all hover:bg-tertiary hover:text-on-tertiary-container"
              >
                VIEW ITEM
              </LinkButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
