import { Icon, type IconName } from "@/components/ui/icon";
import { SoonLink } from "./soon-link";

const LEGAL = ["Terms of Service", "Privacy Policy", "Steam Web API Policy"];

const MARKET_PILLARS: { icon: IconName; tone: string; title: string; body: string }[] = [
  { icon: "smart_toy", tone: "text-primary", title: "Secure Bot Engine", body: "1,248 Trading Nodes Active" },
  { icon: "dns", tone: "text-status-upcoming", title: "Steam API 99.99%", body: "Instant Inventory Sync" },
  { icon: "bolt", tone: "text-tertiary", title: "Escrow 0-sec", body: "Automated Instant Settlement" },
  { icon: "military_tech", tone: "text-secondary", title: "Tier-1 Insured", body: "$10M Liquidity Protection" },
];

export function MarketFooter() {
  return (
    <footer className="mt-space-xl w-full bg-surface-deep text-text-secondary">
      <div className="w-full px-gutter-desktop py-space-lg">
        <div className="mb-space-lg grid grid-cols-1 gap-space-lg py-space-md md:grid-cols-4">
          {MARKET_PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex items-center gap-space-md rounded bg-surface-container-lowest p-space-md">
              <Icon name={pillar.icon} className={`${pillar.tone} text-[28px]`} />
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-text-primary">{pillar.title}</div>
                <div className="font-body-sm text-body-sm text-text-muted">{pillar.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-space-md pt-space-md md:flex-row">
          <div className="flex items-center gap-space-md">
            <span className="font-headline-sm text-headline-sm font-bold text-text-primary">Relicto PRO</span>
            <span className="font-body-sm text-body-sm text-text-muted">
              © 2025 Relicto Global Esports Exchange. Not affiliated with Valve Corp.
            </span>
          </div>
          <div className="flex items-center gap-space-lg font-label-caps text-label-caps tracking-wider uppercase">
            {[...LEGAL, "Bug Bounty"].map((label) => (
              <SoonLink key={label} label={label} className="text-on-surface-variant uppercase transition-colors hover:text-on-surface" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LedgerFooter() {
  return (
    <footer className="mt-space-xl w-full bg-surface-deep">
      <div className="flex w-full flex-col items-center justify-between gap-space-md px-gutter-desktop py-space-lg md:flex-row">
        <div className="flex flex-col items-center gap-space-md text-center sm:flex-row sm:text-left">
          <span className="font-label-caps text-label-caps text-text-muted">© 2025 Relicto EXCHANGE. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-space-xs rounded bg-surface-container px-space-sm py-1 font-label-badge text-label-badge text-on-surface-variant">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
            <span className="font-semibold text-text-primary">Operational Status:</span>
            <span>Escrow Vault Active</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-space-md font-label-caps text-label-caps text-text-muted">
          {[...LEGAL, "Security SLA", "Bug Bounty"].map((label) => (
            <SoonLink key={label} label={label} className="uppercase transition-colors hover:text-on-surface" />
          ))}
        </div>
      </div>
    </footer>
  );
}

export function StudioFooter() {
  const links = ["Security Proofs", "Steam Guard Rules", "Anti-Fraud Policy", "API Documentation"];
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 bg-surface-dim/95 shadow-[0_-4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <div className="flex h-12 w-full items-center justify-between px-margin-desktop font-label-badge text-label-badge text-on-surface-variant">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-upcoming" />
            <span className="font-label-badge tracking-wider text-text-primary uppercase">Operational Status:</span>
            <span className="font-semibold text-status-upcoming uppercase">Escrow Vault Active</span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Icon name="sync" className="text-[14px] text-tertiary" />
            <span className="text-text-secondary">
              Steam Web API: <span className="font-bold text-tertiary">99.99% synced</span>
            </span>
          </div>
          <div className="hidden items-center gap-1.5 text-text-muted lg:flex">
            <Icon name="timer" className="text-[14px]" />
            <span>Response 14ms</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md font-label-caps text-label-badge tracking-wider uppercase">
          {links.map((label) => (
            <span key={label} className="contents">
              <SoonLink label={label} className="uppercase transition-colors hover:text-primary" />
              <span className="text-outline-variant">/</span>
            </span>
          ))}
          <span className="font-data-mono-md text-text-muted">© 2025 Relicto EXCHANGE</span>
        </div>
      </div>
    </footer>
  );
}
