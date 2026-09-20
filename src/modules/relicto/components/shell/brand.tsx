import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Icon } from "@/components/ui/icon";

/** Relicto wordmarks as drawn in each header family. All link home to the marketplace. */

export function MarketBrand() {
  return (
    <Link href="/marketplace" className="group flex items-center gap-space-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)]">
        <Icon name="swords" className="text-[20px] text-on-primary-container" />
      </div>
      <div className="flex flex-col">
        <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary">
          Relicto
          <span className="ml-1 font-light text-primary">PRO</span>
        </span>
        <span className="font-label-badge text-label-badge tracking-wider text-tertiary uppercase">Steam Intel Exchange</span>
      </div>
    </Link>
  );
}

export function LedgerBrand() {
  return (
    <Link href="/marketplace" className="group flex items-center gap-space-sm text-left">
      <div className="flex flex-col">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase transition-colors group-hover:text-primary">
            Relicto
          </span>
          <span className="rounded bg-primary-container px-space-xs py-0.5 font-label-badge text-label-badge font-bold tracking-wider text-on-primary-container uppercase">
            PRO
          </span>
        </div>
        <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">STEAM INTEL EXCHANGE</span>
      </div>
    </Link>
  );
}

export function StudioBrand() {
  return (
    <Link href="/marketplace" className="flex items-center gap-space-sm">
      <div className="flex h-10 w-10 items-center justify-center bg-surface-card shadow-[0_0_16px_rgba(244,63,94,0.3)]">
        <Icon name="token" className="text-[24px] text-primary" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-space-xs">
          <span className="font-headline-sm text-headline-sm tracking-wider text-text-primary uppercase">Relicto</span>
          <span className="rounded bg-primary-container px-1.5 py-0.5 font-label-badge text-label-badge text-on-primary-container">
            PRO
          </span>
        </div>
        <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">STEAM INTEL EXCHANGE</span>
      </div>
    </Link>
  );
}

export function HubBrand() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-container shadow-[0_0_16px_rgba(244,63,94,0.4)] transition-colors group-hover:bg-rose-400">
        <ShieldAlert className="size-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="flex items-center gap-1.5 text-lg leading-none font-bold tracking-tight text-white uppercase">
          Relicto
          <span className="rounded border border-primary/30 bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-primary">
            PRO
          </span>
        </span>
        <span className="mt-1 font-mono text-[9px] tracking-widest text-text-muted uppercase">Intel Exchange</span>
      </div>
    </Link>
  );
}

export function VaultBrand() {
  return (
    <Link href="/marketplace" className="group flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border-tactical bg-surface-container-lowest shadow-[0_0_16px_rgba(245,158,11,0.25)] transition-all group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]">
        <Icon name="shield" className="text-[24px] text-tertiary" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 animate-ping rounded-full bg-status-live" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-status-live" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-headline-sm text-[18px] font-bold tracking-tight text-text-primary transition-colors group-hover:text-tertiary">RELICTO</span>
          <span className="rounded border border-border-subtle bg-surface-container px-1.5 py-0.5 font-label-badge text-[10px] font-bold text-tertiary">PRO</span>
        </div>
        <span className="font-label-badge text-[10px] leading-none tracking-widest text-text-muted uppercase">Steam Intel Exchange</span>
      </div>
    </Link>
  );
}
