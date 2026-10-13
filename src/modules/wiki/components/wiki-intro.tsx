import { Icon } from "@/components/ui/icon";

export function WikiIntro() {
  return (
    <section className="px-margin-desktop pt-space-lg pb-space-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-xs font-label-badge text-label-badge tracking-widest text-text-muted uppercase">
          <span>Portal</span>
          <span>/</span>
          <span>Codex &amp; Wiki</span>
          <span>/</span>
          <span className="text-primary">Comprehensive Valve Asset Encyclopedia</span>
          <span className="rounded bg-surface-container-high px-space-xs py-0.5 text-status-upcoming">
            Archive Build 9.4.1
          </span>
        </div>
        <div className="flex flex-col justify-between gap-space-lg xl:flex-row xl:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-sm">
              <Icon name="query_stats" className="text-[28px] text-primary" />
              <span className="font-label-caps text-label-caps tracking-wider text-tertiary uppercase">
                Verified Scientific Record
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl tracking-tight text-text-primary">
              Valve Skin Economy &amp; Pattern Codex
            </h1>
            <p className="mt-space-xs max-w-3xl text-text-secondary">
              Authoritative mathematical compendium for Counter-Strike 2 seed
              coordinates, Doppler light refraction indexes, Dota 2 courier
              ethereal matrixes, and trade-up float deterministic math.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-4">
            {[
              ["Documented Skins", "18,490", "100% CS2/Dota Parity", "text-status-upcoming"],
              ["Pattern Seeds", "1,420", "1-1000 Coordinate Maps", "text-tertiary"],
              ["24h Wiki Revisions", "142", "Active Verification", "text-primary"],
              ["Expert Contributors", "890", "Steam Alumni & Quants", "text-secondary"],
            ].map(([label, value, note, tone]) => (
              <div
                key={label}
                className="flex flex-col rounded bg-surface-card/80 px-space-md py-space-sm shadow-md"
              >
                <span className="font-label-badge text-[10px] text-text-muted uppercase">{label}</span>
                <span className={`mt-0.5 font-data-mono-lg text-data-mono-lg ${tone}`}>{value}</span>
                <span className={`mt-0.5 text-[10px] ${tone}`}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
