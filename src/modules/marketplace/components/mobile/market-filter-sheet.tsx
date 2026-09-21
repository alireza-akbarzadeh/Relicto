"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { BAND_LABEL, LOW_FLOAT, SORT_LABEL } from "../../lib/mobile-filters";
import { MOBILE_CATEGORIES, MOBILE_SORTS, PRICE_BANDS } from "../../mobile.types";
import { useMobileMarket } from "../../state/mobile-market-provider";

const CATEGORY_LABEL = { all: "All Items", dota2: "Dota 2", cs2: "CS2", arcana: "Arcanas", knives: "Knives", gloves: "Gloves", souvenirs: "Souvenirs" };

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button
      variant={null}
      size={null}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-auto rounded-full border-0 px-3.5 py-1.5 font-label-caps text-label-caps font-bold uppercase transition-colors",
        active ? "bg-primary/15 text-primary" : "bg-surface-container-low text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
    </Button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-space-sm">
      <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">{title}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/** "Filter matrix": every mobile facet in one bottom sheet, all written to the URL. */
export function MarketFilterSheet() {
  const { criteria, set, reset, results, filtered } = useMobileMarket();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant={null}
            size={null}
            aria-label="Open filter matrix"
            className="h-11 gap-1.5 rounded-xl border-0 bg-surface-container-low px-3.5 text-text-primary shadow-xs transition-transform active:scale-95"
          />
        }
      >
        <Icon name="tune" className="text-[20px] text-secondary" />
        <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] gap-space-md rounded-t-xl border-0 bg-surface-card p-space-md text-on-surface">
        <SheetHeader className="p-0">
          <SheetTitle className="font-headline-sm text-headline-sm text-text-primary">Filter Matrix</SheetTitle>
          <SheetDescription className="font-body-sm text-body-sm text-text-secondary">
            {results.length} listings match. Filters stay in the link, so you can share this view.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-space-md overflow-y-auto">
          <Group title="Category">
            {MOBILE_CATEGORIES.map((cat) => (
              <Choice key={cat} active={criteria.cat === cat} onClick={() => set({ cat })}>
                {CATEGORY_LABEL[cat]}
              </Choice>
            ))}
          </Group>
          <Group title="Sort">
            {MOBILE_SORTS.map((msort) => (
              <Choice key={msort} active={criteria.msort === msort} onClick={() => set({ msort })}>
                {SORT_LABEL[msort]}
              </Choice>
            ))}
          </Group>
          <Group title="Price Band">
            {PRICE_BANDS.map((band) => (
              <Choice key={band} active={criteria.band === band} onClick={() => set({ band })}>
                {BAND_LABEL[band]}
              </Choice>
            ))}
          </Group>
          <label className="flex items-center justify-between rounded-xl bg-surface-container-low px-3.5 py-3">
            <span className="flex flex-col">
              <span className="font-body-md text-body-md text-text-primary">Low float only</span>
              <span className="font-body-sm text-body-sm text-text-muted">CS2 skins under {LOW_FLOAT} wear</span>
            </span>
            <Switch checked={criteria.lowFloat} onCheckedChange={(lowFloat) => set({ lowFloat })} />
          </label>
        </div>

        <SheetFooter className="flex-row gap-space-sm p-0">
          <Button
            variant={null}
            size={null}
            onClick={reset}
            disabled={!filtered}
            className="h-11 flex-1 rounded-xl border-0 bg-surface-container-high font-label-caps text-label-caps font-bold text-text-primary uppercase"
          >
            Reset
          </Button>
          <SheetClose
            render={
              <Button
                variant={null}
                size={null}
                className="h-11 flex-[2] rounded-xl border-0 bg-primary font-label-caps text-label-caps font-bold text-on-primary uppercase shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              />
            }
          >
            Show {results.length} listings
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
