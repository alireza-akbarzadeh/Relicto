import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function CheckoutIntro({ session, count }: { session: string; count: number }) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-white/6 pb-6 lg:flex-row lg:items-end">
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2 font-body-sm text-xs text-text-muted">
          <Link href="/marketplace" className="transition-colors hover:text-text-primary">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Cart ({count})</span>
          <span>/</span>
          <span className="font-semibold text-primary">Checkout</span>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-headline-lg text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Escrow Checkout &amp; Dispatch
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-surface-container-high px-3 py-1 font-data-mono-md text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming animate-pulse" />
            Protocol {session}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-surface-card px-4 py-2 text-xs shadow-sm">
          <Status icon="bolt" value="14 Bots Active" tone="text-status-upcoming" />
          <span className="h-3 w-px bg-white/10" />
          <Status icon="speed" value="12ms Ping" tone="text-text-secondary" />
          <span className="h-3 w-px bg-white/10" />
          <Status icon="lock_clock" value="Vault Locked" tone="text-tertiary" />
        </div>
      </div>
    </div>
  );
}

function Status({ icon, value, tone }: { icon: "bolt" | "speed" | "lock_clock"; value: string; tone: string }) {
  return (
    <span className={`flex items-center gap-1.5 font-data-mono-md text-xs font-medium ${tone}`}>
      <Icon name={icon} className="text-[14px]" />
      {value}
    </span>
  );
}
