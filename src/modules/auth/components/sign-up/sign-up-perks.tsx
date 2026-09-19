import { Icon, type IconName } from "@/components/ui/icon";

const PERKS: { icon: IconName; badge: string; title: string; body: string; check: string; accent: "tertiary" | "primary" | "cyan" }[] = [
  { icon: "percent", badge: "FIRST $5,000", title: "0% Maker Listing Fees", body: "Keep 100% of your earnings on Dota 2 Immortals & CS2 Knives during your first 30 days active.", check: "Standard fee 2.5% waived", accent: "tertiary" },
  { icon: "speed", badge: "< 60 SEC DELIVERY", title: "Instant Bot Escrow", body: "Automated Steam trade offer bots dispatch trades instantaneously without API scam vulnerabilities.", check: "SHA256 encrypted handshake", accent: "primary" },
  { icon: "query_stats", badge: "PATCH 7.38c & CS2", title: "Real-time Telemetry", body: "Stream dynamic live market depth, price swings, tournament hype surges, and meta weapon trends.", check: "Millisecond Webhook feeds", accent: "cyan" },
];

const ACCENT = {
  tertiary: { card: "hover:border-tertiary/40", icon: "border-tertiary/30 text-tertiary group-hover:border-tertiary", badge: "border-tertiary/30 bg-tertiary/10 text-tertiary" },
  primary: { card: "hover:border-primary/40", icon: "border-primary/30 text-primary group-hover:border-primary", badge: "border-primary/30 bg-primary/10 text-primary" },
  cyan: { card: "hover:border-status-upcoming/40", icon: "border-status-upcoming/30 text-status-upcoming group-hover:border-status-upcoming", badge: "border-status-upcoming/30 bg-status-upcoming/10 text-status-upcoming" },
} as const;

/** Trader benefit cards + 24h settlement pulse under the sign-up card. */
export function SignUpPerks() {
  return (
    <>
      <div className="mt-1 grid grid-cols-1 gap-3 md:grid-cols-3">
        {PERKS.map((perk) => {
          const a = ACCENT[perk.accent];
          return (
            <div key={perk.title} className={`group flex flex-col gap-2 rounded-xl border border-white/10 bg-surface-card/80 p-4 shadow-lg backdrop-blur-md transition-all ${a.card}`}>
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border bg-surface-deep transition-colors ${a.icon}`}>
                  <Icon name={perk.icon} className="text-[20px]" />
                </div>
                <span className={`rounded border px-2 py-0.5 font-label-badge text-[10px] font-semibold ${a.badge}`}>{perk.badge}</span>
              </div>
              <h3 className="mt-1 font-headline-sm text-sm font-bold tracking-tight text-text-primary uppercase">{perk.title}</h3>
              <p className="font-body-sm text-xs leading-relaxed text-text-secondary">{perk.body}</p>
              <div className="mt-1 flex items-center gap-1 font-data-mono-md text-[10px] text-emerald-400">
                <Icon name="check" className="text-[13px]" /> {perk.check}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/5 bg-surface-card/60 p-4 shadow-md backdrop-blur-xs sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-secondary/30 bg-surface-deep text-secondary">
            <Icon name="trending_up" className="text-[20px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-xs font-semibold text-text-primary uppercase">Escrow Settlement Volume (24h)</span>
            <div className="flex items-baseline gap-2">
              <span className="font-data-mono-lg text-lg font-bold text-tertiary">$1,482,920.40 USD</span>
              <span className="font-data-mono-md text-[11px] font-semibold text-status-upcoming">+14.2%</span>
            </div>
          </div>
        </div>
        <div className="flex h-8 w-full items-center sm:w-60">
          <svg className="h-8 w-full overflow-visible" fill="none" viewBox="0 0 200 40" aria-hidden>
            <defs>
              <linearGradient id="sparklineGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff516a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ff516a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 32 L20 28 L40 30 L60 22 L80 25 L100 15 L120 18 L140 10 L160 14 L180 6 L200 4 L200 40 L0 40 Z" fill="url(#sparklineGrad)" />
            <path d="M0 32 L20 28 L40 30 L60 22 L80 25 L100 15 L120 18 L140 10 L160 14 L180 6 L200 4" stroke="#ffb2b7" strokeLinecap="round" strokeWidth="2" />
            <circle className="animate-pulse" cx="200" cy="4" fill="#ff516a" r="3.5" />
          </svg>
        </div>
      </div>
    </>
  );
}
