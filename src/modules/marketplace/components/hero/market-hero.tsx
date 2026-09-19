import { EcosystemPills } from "./ecosystem-pills";
import { HeroSearch } from "./hero-search";
import { TrendingTags } from "./trending-tags";

/** "Discover your next drop" hero with the global item search. */
export function MarketHero() {
  return (
    <div className="relative z-10 w-full px-margin-desktop py-space-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="mb-space-md flex items-center gap-space-sm rounded-full bg-surface-container-low px-space-md py-1 shadow-xs">
          <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
          <span className="font-label-badge text-label-badge tracking-wider text-text-primary uppercase">
            Valve Steam Engine Live Telemetry
          </span>
          <span className="text-text-muted">·</span>
          <span className="font-data-mono-md text-data-mono-md text-tertiary">142,890 Active Drops</span>
        </div>
        <h1 className="mb-space-sm font-display-hero text-display-hero tracking-tight text-text-primary uppercase">
          Discover Your{" "}
          <span className="bg-linear-to-r/srgb from-primary via-tertiary to-secondary bg-clip-text text-transparent">
            Next Drop
          </span>
        </h1>
        <p className="mb-space-lg max-w-3xl font-body-lg text-body-lg text-text-secondary">
          Explore 48,000+ verified Steam cosmetics, compare real-time pricing telemetry, and execute zero-escrow trades
          across Valve ecosystems with sub-second order fulfillment.
        </p>
        <HeroSearch />
        <EcosystemPills />
        <TrendingTags />
      </div>
    </div>
  );
}
