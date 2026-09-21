import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatDelta } from "@/lib/format";
import type { HubMobileData } from "../../mobile.types";

/** Skins riding the latest patch and major, two up. */
export function SurgeIndex({ surge }: { surge: HubMobileData["surge"] }) {
  return (
    <div className="flex flex-col gap-2 px-margin">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="trending_up" className="text-[20px] text-tertiary" />
          <h2 className="font-headline-sm text-headline-sm text-text-primary">Patch Skin Surge Index</h2>
        </div>
        <span className="font-label-badge text-label-badge text-tertiary">{surge.patch}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {surge.items.map((item) => (
          <Link key={item.slug} href={`/items/${item.slug}`} className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-surface-card p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span
                className={`rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-badge text-label-badge ${item.tagTone === "rose" ? "text-primary-fixed-dim" : "text-tertiary"}`}
              >
                {item.tag}
              </span>
              <div className="flex items-center font-data-mono-md text-label-badge text-emerald-400">
                <span>{formatDelta(item.changePct)}</span>
                <Icon name="arrow_drop_up" className="text-[14px]" />
              </div>
            </div>
            <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest">
              <Image src={item.image} alt={item.imageAlt} width={320} height={160} sizes="50vw" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t/srgb from-surface-card via-transparent to-transparent" />
            </div>
            <div>
              <p className="truncate font-headline-sm text-label-caps text-text-primary">{item.name}</p>
              <div className="flex items-baseline justify-between pt-0.5">
                <span className="font-data-mono-md text-data-mono-md text-text-primary">{item.price}</span>
                <span className="font-label-badge text-label-badge text-text-secondary">{item.note}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
