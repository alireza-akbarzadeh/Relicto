import { Icon } from "@/components/ui/icon";

export function WalletCompliance() {
  const items = [["policy", "Anti-Money Laundering Safeguard", "All transactions undergo real-time heuristic risk audits compliant with FinCEN and EU 5AMLD protocols."], ["vpn_key", "Steam OpenID & API Key Isolation", "Our bot fleet operates within zero-trust secure enclaves. Credentials and trade URL tokens use hardware-backed encryption."], ["support_agent", "24/7 Priority Treasury Dispatch", "VIP desk resolves custom OTC liquidity and manual wire clearances in under 15 minutes."] ] as const;
  return <section className="grid grid-cols-1 gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-md md:grid-cols-3">{items.map(([icon, title, body]) => <div key={title} className="flex items-start gap-space-sm"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-card text-primary"><Icon name={icon} className="text-[20px]" /></div><div><h4 className="font-headline-sm text-body-sm text-text-primary">{title}</h4><p className="mt-1 text-[12px] leading-relaxed text-text-muted">{body}</p></div></div>)}</section>;
}
