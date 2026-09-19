import { RefreshCw, Zap } from "lucide-react";
import { SoonLink } from "./soon-link";

const LINKS = ["Security Proofs", "Steam Guard Rules", "Anti-Fraud Policy"];

/** Footer of the game hub: live platform status, legal links and build stamp. */
export function HubFooter() {
  return (
    <footer className="mt-12 w-full border-t border-border-dark bg-surface-container-lowest text-text-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 font-mono text-xs leading-4 sm:px-8 md:flex-row">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-status-live" />
            <span className="text-[10px] font-bold text-white uppercase">Escrow Vault Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <RefreshCw className="size-3.5 text-status-upcoming" />
            <span>Steam Web API 99.99% Synced</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-tertiary">
            <Zap className="size-3.5" />
            <span>14ms Response</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          {LINKS.map((label, index) => (
            <span key={label} className="contents">
              {index > 0 && <span>•</span>}
              <SoonLink label={label} className="transition-colors hover:text-white" />
            </span>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-surface-container bg-surface px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs leading-4 sm:flex-row">
          <p className="text-[11px] text-text-muted">© 2024 Relicto Exchange. Powered by Steam OpenID. Valve Corporation unassociated.</p>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="text-text-muted uppercase">NODE ID: ORD-901-PRO</span>
            <span className="rounded border border-border-dark bg-surface-container-high px-1.5 py-0.5 text-white">MAINNET v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
