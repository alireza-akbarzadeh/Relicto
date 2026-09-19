import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const NAV = [
  { id: "desk", label: "Exchange Desk", href: "/marketplace" },
  { id: "gate", label: "Authentication Gate", href: "/sign-in" },
  { id: "sla", label: "Security SLA", href: "/verify" },
] as const;

export type AuthNavId = (typeof NAV)[number]["id"];

/** Top bar shared by every auth screen (sign in, sign up, 2FA, recovery). */
export function AuthHeader({ active }: { active: AuthNavId }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-white/10 bg-surface-deep/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/marketplace" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-surface-card shadow-inner transition-colors group-hover:border-primary-container/50">
              <Icon name="token" className="text-[22px] text-primary-container" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-white uppercase transition-colors group-hover:text-primary-container">
                  Relicto
                </span>
                <span className="rounded border border-primary-container/30 bg-primary-container/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-primary-container">
                  PRO
                </span>
              </div>
              <span className="font-display text-[10px] font-medium tracking-wider text-text-secondary uppercase">Steam Intel Exchange</span>
            </div>
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-status-upcoming/20 bg-surface-card px-2.5 py-1 shadow-[0_0_12px_rgba(6,182,212,0.15)] lg:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-status-upcoming" />
            <span className="font-mono text-[11px] font-medium tracking-wider text-status-upcoming uppercase">
              STEAM OPENID 2.0 SYNCED & VERIFIED
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-1 rounded-lg border border-white/5 bg-surface-card/60 p-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={item.id === active ? "page" : undefined}
              className={cn(
                "rounded-md px-3.5 py-1.5 font-display text-xs font-semibold transition-all",
                item.id === active
                  ? "border border-white/10 bg-surface-container text-white shadow-xs"
                  : "text-text-secondary hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded border border-white/5 bg-surface-card/50 px-2.5 py-1 text-[#cbd5e1] sm:flex">
            <Icon name="lock" className="text-[18px] text-tertiary" />
            <span className="font-mono text-xs font-medium tracking-wider text-[#cbd5e1]">256-BIT ESCROW</span>
          </div>
          <Link
            href="/sign-in"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-transform hover:scale-105 hover:bg-[#ff3b57]"
          >
            <Icon name="person" className="text-[20px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
