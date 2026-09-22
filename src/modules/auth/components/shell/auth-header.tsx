import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Icon } from "@/components/ui/icon";

export type AuthPage = "sign-in" | "sign-up" | "verify" | "reset";

/** Where the header's right-side CTA sends you from each auth screen. */
const CTA: Record<AuthPage, { label: string; href: string }> = {
  "sign-in": { label: "Create account", href: "/sign-up" },
  "sign-up": { label: "Sign in", href: "/sign-in" },
  verify: { label: "Back to sign in", href: "/sign-in" },
  reset: { label: "Back to sign in", href: "/sign-in" },
};

/** Top bar shared by every auth screen (sign in, sign up, 2FA, recovery). */
export function AuthHeader({ page }: { page: AuthPage }) {
  const cta = CTA[page];

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-white/10 bg-surface-deep/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded border border-white/5 bg-surface-card/50 px-2.5 py-1 text-slate-300 sm:flex">
            <Icon name="lock" className="text-[18px] text-tertiary" />
            <span className="font-mono text-xs font-medium tracking-wider text-slate-300">256-BIT ESCROW</span>
          </div>
          <ThemeToggle className="h-9 w-9 rounded-full border border-white/5 bg-surface-card/50 text-slate-300 hover:text-white" />
          <Link
            href={cta.href}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-surface-card/60 px-3.5 py-2 font-display text-xs font-semibold tracking-wider text-text-secondary uppercase transition-colors hover:border-primary-container/50 hover:text-white"
          >
            {cta.label}
            <Icon name="arrow_forward" className="text-[14px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
