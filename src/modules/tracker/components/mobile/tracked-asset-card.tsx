"use client";

import Image from "next/image";
import Link from "next/link";
import { useDopplerPhase } from "../../hooks/use-doppler-phase";
import type { TrackerMobileData } from "../../mobile.types";

/** The knife under watch: rarity, rank, phase + wear, and the float meter. */
export function TrackedAssetCard({ data }: { data: TrackerMobileData }) {
  const { asset } = data;
  const { active } = useDopplerPhase(data.phases, data.defaultPhase);

  return (
    <div className="px-4">
      <div className="relative overflow-hidden rounded-xl bg-surface-container p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary-container px-1.5 py-0.5 font-label-badge text-label-badge font-bold text-on-primary-container uppercase">
                {asset.rarity}
              </span>
              <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-label-badge font-bold text-tertiary">{asset.rank}</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-text-primary">
              <Link href={`/items/${asset.slug}`}>{asset.name}</Link>
            </h2>
            <p className="font-body-md text-body-md font-medium text-text-secondary">
              Doppler {active.label} • {asset.wear}
            </p>
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-surface-container-highest shadow-inner">
            <Image src={asset.image} alt={asset.imageAlt} width={128} height={128} sizes="64px" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-lg bg-surface-container-low/70 p-3">
          <div className="flex items-center justify-between text-text-muted">
            <span className="font-label-caps text-label-caps uppercase">Float Telemetry</span>
            <span className="font-data-mono-md text-data-mono-md font-bold text-text-primary">{asset.float}</span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="absolute top-0 bottom-0 left-0 bg-primary shadow-[0_0_8px_var(--color-primary-container)]"
              style={{ width: `${asset.meterPct}%` }}
            />
          </div>
          <div className="flex justify-between font-label-badge text-label-badge text-text-muted">
            {asset.wearBands.map((band, index) => (
              <span key={band} className={index === 0 ? "font-semibold text-primary" : undefined}>
                {band}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
