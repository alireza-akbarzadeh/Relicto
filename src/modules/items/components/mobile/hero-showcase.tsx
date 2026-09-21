import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import type { ItemMobile } from "../../mobile.types";

/** Holographic reticle over the render. */
function Reticle() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" aria-hidden>
      <circle className="text-secondary" cx="50%" cy="50%" fill="none" r="90" stroke="currentColor" strokeDasharray="4 6" />
      <circle className="text-primary" cx="50%" cy="50%" fill="none" r="130" stroke="currentColor" strokeDasharray="2 10" />
      <line className="text-tertiary" stroke="currentColor" strokeWidth="1.5" x1="50%" x2="50%" y1="15%" y2="25%" />
      <line className="text-tertiary" stroke="currentColor" strokeWidth="1.5" x1="50%" x2="50%" y1="75%" y2="85%" />
    </svg>
  );
}

/** Cinematic render with rarity chips, live badge and the kinetic gem bar. */
export function HeroShowcase({ item }: { item: ItemMobile }) {
  return (
    <div className="relative w-full overflow-hidden bg-surface-container-low">
      <div className="pointer-events-none absolute -top-12 -left-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />

      <div className="pointer-events-none absolute top-space-md right-space-md left-space-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="rounded-lg bg-primary-container px-space-sm py-0.5 font-label-caps text-label-caps tracking-widest text-on-primary shadow-md">
            {item.rarity}
          </span>
          <span className="rounded-lg bg-surface-container-highest px-space-xs py-0.5 font-label-badge text-label-badge font-bold text-tertiary">
            {item.tier}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-surface-container-lowest/90 px-space-sm py-0.5 font-data-mono-md text-data-mono-md text-text-primary backdrop-blur-md">
          <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
          <span className="font-label-badge text-[11px] font-bold tracking-wider text-status-live uppercase">LIVE TELEMETRY</span>
        </div>
      </div>

      <div className="relative flex h-80 w-full items-center justify-center p-space-md">
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={720}
          height={640}
          sizes="100vw"
          priority
          className="h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(244,63,94,0.35)] select-none"
        />
        <Reticle />
      </div>

      <div className="px-space-md pb-space-md">
        <div className="flex w-full items-center justify-between rounded-xl bg-surface-card/90 p-space-sm shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <Icon name="swords" filled className="text-[20px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-badge text-label-badge text-text-muted uppercase">{item.gem.label}</span>
              <span className="font-data-mono-md text-data-mono-md font-bold text-text-primary">{item.gem.value}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-surface-container-lowest px-space-sm py-1 font-label-badge text-label-badge font-bold text-tertiary">
            <Icon name="military_tech" className="text-[14px]" />
            {item.gem.level}
          </div>
        </div>
      </div>
    </div>
  );
}
