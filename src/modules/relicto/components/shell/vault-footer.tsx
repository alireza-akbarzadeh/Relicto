import { Icon } from "@/components/ui/icon";
import { SoonLink } from "./soon-link";

const LEGAL = ["Terms of Service", "Privacy Policy", "Escrow SLA", "API Documentation"];

/** Footer of the item vault screens: trademark notice and live API status. */
export function VaultFooter() {
  return (
    <footer className="w-full border-t border-border-subtle bg-surface-deep py-8 text-text-muted">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-4 md:flex-row lg:px-8">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="font-headline-sm text-sm font-bold text-text-primary">RELICTO METRIC ENGINE</span>
            <span className="rounded border border-border-subtle bg-surface-container-lowest px-2 py-0.5 font-label-badge text-[10px] font-semibold text-status-upcoming">
              SECURE BOT NETWORK
            </span>
          </div>
          <p className="max-w-2xl font-body-sm text-xs leading-relaxed text-text-muted">
            Steam and Dota 2 are registered trademarks of Valve Corporation. Relicto is not affiliated with, endorsed by, or associated with Valve
            Corporation in any way. All trademarks, game logos, and skins remain copyright of their respective owners.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="font-label-badge text-[9px] text-text-muted uppercase">Steam API Status</span>
              <span className="font-data-mono-md text-xs font-semibold text-text-primary">Synced (12ms)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-1.5">
            <Icon name="verified_user" className="text-[18px] text-tertiary" />
            <div className="flex flex-col text-left">
              <span className="font-label-badge text-[9px] text-text-muted uppercase">Escrow Protocol</span>
              <span className="font-data-mono-md text-xs font-semibold text-tertiary">0-Sec Guarantee</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-[1440px] flex-col items-center justify-between gap-2 border-t border-border-subtle/30 px-4 pt-4 font-label-badge text-[11px] text-text-muted sm:flex-row lg:px-8">
        <p>© 2025 RELICTO SYSTEMS LLC. ALL RIGHTS RESERVED.</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:mt-0">
          {LEGAL.map((label) => (
            <SoonLink key={label} label={label} className="transition-colors hover:text-tertiary" />
          ))}
        </div>
      </div>
    </footer>
  );
}
