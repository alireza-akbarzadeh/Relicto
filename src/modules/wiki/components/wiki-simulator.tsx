import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WikiSimulator({
  float,
  setFloat,
  computed,
}: {
  float: string;
  setFloat: (value: string) => void;
  computed: string;
}) {
  return (
    <section className="px-margin-desktop py-space-lg">
      <div className="mx-auto max-w-7xl rounded-xl bg-surface-container-lowest p-space-lg shadow-xl">
        <div className="mb-space-md">
          <span className="font-label-caps text-label-caps text-primary uppercase">
            Embedded Simulator &amp; Lab
          </span>
          <h2 className="font-headline-lg text-headline-lg text-text-primary">
            Interactive Contract Math &amp; Float Simulator
          </h2>
          <p className="text-text-secondary">
            Direct algorithmic projection engine for deterministic float outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
          <div className="rounded-lg bg-surface-card p-space-md">
            <label className="font-label-caps text-label-caps text-text-muted uppercase">
              Average 10-Skin Input Float
              <Input
                type="number"
                value={float}
                onChange={(event) => setFloat(event.target.value)}
                className="mt-2 h-auto bg-surface-container-lowest font-data-mono-md text-text-primary"
              />
            </label>
            <div className="mt-space-md flex flex-wrap gap-2">
              {["AWP | Dragon Lore", "AK-47 | Fire Serpent", "M4A4 | Howl"].map(
                (preset) => (
                  <Button
                    key={preset}
                    variant={null}
                    size={null}
                    onClick={() =>
                      setFloat(
                        preset.includes("AWP")
                          ? "0.0284"
                          : preset.includes("AK")
                            ? "0.064"
                            : "0.12",
                      )
                    }
                    className="h-auto rounded bg-surface-container-high px-2 py-1 font-label-badge text-[10px] text-text-secondary"
                  >
                    {preset}
                  </Button>
                ),
              )}
            </div>
          </div>
          <div className="rounded-lg bg-surface-card p-space-md">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">
              Computed Yield Outcome
            </span>
            <div className="mt-3 rounded bg-surface-container-lowest p-space-lg text-center">
              <span className="font-label-badge text-label-badge text-text-muted uppercase">
                Exact Deterministic Float
              </span>
              <strong className="block font-data-mono-lg text-2xl text-tertiary">
                {computed}
              </strong>
              <span className="font-label-badge text-[10px] text-status-upcoming">
                FACTORY NEW · 100% GUARANTEED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
