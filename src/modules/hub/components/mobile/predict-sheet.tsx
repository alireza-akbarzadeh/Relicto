"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import type { ArenaMatch } from "../../mobile.types";

/** "Predict & Win Skin": bottom sheet to lock in the map winner. */
export function PredictSheet({ match }: { match: ArenaMatch }) {
  const [open, setOpen] = useState(false);

  const lockIn = (index: 0 | 1) => {
    const team = match.teams[index];
    setOpen(false);
    toast.success(`Prediction locked: ${team.fullName}`, { description: `${team.odds} multiplier on the ${match.stage.toLowerCase()} map.` });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant={null}
            size={null}
            className="h-11 flex-1 gap-2 rounded-lg border-0 bg-primary-container font-headline-sm text-headline-sm font-semibold tracking-wider text-on-primary uppercase shadow-[0_0_18px_rgba(244,63,94,0.4)] transition-all hover:bg-primary active:scale-[0.98]"
          />
        }
      >
        <Icon name="casino" className="text-[20px]" />
        <span>Predict &amp; Win Skin</span>
      </SheetTrigger>
      <SheetContent side="bottom" showCloseButton={false} className="gap-3 rounded-t-2xl border-0 bg-surface-dim/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="mb-1 h-1 w-12 self-center rounded-full bg-surface-variant" />
        <SheetHeader className="flex-row items-center justify-between p-0">
          <div className="flex items-center gap-2">
            <Icon name="verified" className="text-[24px] text-primary-container" />
            <SheetTitle className="font-headline-sm text-headline-sm text-text-primary">Tactical Lock-In</SheetTitle>
          </div>
          <Button
            variant={null}
            size={null}
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="h-8 w-8 rounded-full border-0 bg-surface-container text-text-secondary hover:text-text-primary"
          >
            <Icon name="close" className="text-[18px]" />
          </Button>
        </SheetHeader>
        <SheetDescription className="font-body-md text-body-md text-text-secondary">
          Pick winner for {match.clock.split(" • ")[0]} {match.stage.toLowerCase()}. Eligible for instant Battle Pass token drops.
        </SheetDescription>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {match.teams.map((team, index) => (
            <Button
              key={team.name}
              variant={null}
              size={null}
              onClick={() => lockIn(index as 0 | 1)}
              className={cn(
                "h-auto flex-col gap-1 rounded-xl border-0 bg-surface-container-high px-2 py-3 font-headline-sm text-label-caps font-bold text-text-primary transition-all",
                index === 0 ? "hover:bg-primary-container hover:text-on-primary" : "hover:bg-secondary hover:text-on-secondary",
              )}
            >
              <span className="text-[14px]">{team.fullName}</span>
              <span className={cn("font-data-mono-md text-label-badge", index === 0 ? "text-emerald-400" : "text-tertiary")}>{team.odds} Multiplier</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
