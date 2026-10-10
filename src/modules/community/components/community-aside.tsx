"use client";

import Link from "next/link";
import { toast } from "sonner";

export function CommunityAside() {
  return (
    <aside className="flex flex-col gap-space-md xl:col-span-3">
      <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-text-primary">Apex Traders</h2>
          <span className="font-label-badge text-[10px] text-tertiary uppercase">Escrow Volume</span>
        </div>
        {["@ZeroKelly", "@NexusVault", "@CryptoSkins", "@s1mple_cs"].map((name, index) => (
          <div key={name} className="flex items-center justify-between border-b border-white/6 py-3 last:border-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high font-label-badge text-text-secondary">{index + 1}</span>
              <div>
                <b className="block text-sm text-text-primary">{name}</b>
                <span className="font-label-badge text-[10px] text-status-upcoming">100% Trust ({180 - index * 20} vouches)</span>
              </div>
            </div>
            <span className="font-data-mono-md text-[11px] text-tertiary">${[314800, 242150, 189400, 142000][index].toLocaleString()}</span>
          </div>
        ))}
      </section>
      <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">P2P Quick-Trade Board</h2>
        {["AWP Dragon Lore (FT)", "Baby Roshan (Ice)"].map((item, index) => (
          <div key={item} className="mt-3 rounded border-l-2 border-primary bg-surface-container p-3">
            <span className="font-body-sm text-body-sm font-bold text-text-primary">@{index ? "Rostelecom_Pro" : "AgriTrader"}</span>
            <span className="mt-1 block font-label-badge text-[10px] text-text-muted">Seeking: {item}</span>
            <Link
              href={`/marketplace?q=${encodeURIComponent(item)}`}
              className="mt-2 block h-auto w-full rounded bg-primary-container py-1 text-center font-label-caps text-[10px] text-on-primary-container uppercase transition-colors hover:bg-primary"
            >
              Accept Trade
            </Link>
          </div>
        ))}
      </section>
      <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-text-primary">Governance Sentiment</h2>
          <span className="font-label-badge text-[10px] text-text-muted">1,490 Votes</span>
        </div>
        <p className="mt-3 font-body-sm text-body-sm font-semibold text-text-primary">Will Case Hardened Blue Gems hold tier-1 valuation post CS2 lighting engine overhaul?</p>
        {[
          ["Yes, lighting improves blue coverage", "68%", "bg-tertiary"],
          ["No, market pivots to Doppler", "24%", "bg-primary"],
          ["Neutral / Arbitrage Only", "8%", "bg-secondary"],
        ].map(([label, percent, color]) => (
          <div key={label} className="mt-3">
            <div className="flex justify-between font-label-badge text-[10px] text-text-muted">
              <span>{label}</span>
              <b className="text-text-primary">{percent}</b>
            </div>
            <div className="mt-1 h-1.5 rounded bg-surface-container-high">
              <div className={`h-full rounded ${color}`} style={{ width: percent }} />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => toast.success("Cryptographic vote registered on-chain", { description: "Verified with Valve Steam session." })}
          className="mt-4 flex h-auto w-full cursor-pointer items-center justify-center rounded bg-surface-container-high py-2 font-label-caps text-[10px] text-text-primary uppercase transition-colors hover:bg-surface-bright focus-visible:outline-hidden"
        >
          Cast Cryptographic Vote
        </button>
      </section>
    </aside>
  );
}
