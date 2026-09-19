import { ShieldCheck } from "lucide-react";
import type { Loadout } from "../../types";
import { SectionHeading } from "../shared/section-heading";
import { LoadoutCard } from "./loadout-card";

/** "Pro Esports Loadout Showcase": verified championship arsenals. */
export function LoadoutShowcase({ loadouts }: { loadouts: Loadout[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <SectionHeading icon={ShieldCheck} tone="cyan" eyebrow="CHAMPIONSHIP ARSENALS" title="Pro Esports Loadout Showcase" size="lg" />
        <p className="max-w-md text-xs text-text-secondary">
          Verified skin combinations equipped by elite championship teams in sanctioned Valve Major tournament grand finals.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {loadouts.map((loadout) => (
          <LoadoutCard key={loadout.id} loadout={loadout} />
        ))}
      </div>
    </section>
  );
}
