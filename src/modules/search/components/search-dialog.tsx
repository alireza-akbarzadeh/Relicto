"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PaletteBody } from "./palette-body";

type SearchDialogProps = {
  open: boolean;
  session: number;
  initialQuery: string;
  onOpenChange: (open: boolean) => void;
};

/** The global command palette: items, traders and tournaments from `/api/search`, driven by keyboard or pointer. */
export function SearchDialog({
  open,
  session,
  initialQuery,
  onOpenChange,
}: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-canvas-base/80 supports-backdrop-filter:backdrop-blur-md"
        className="top-8 flex max-h-[calc(100dvh-4rem)] w-[calc(100%-2rem)] max-w-[820px] translate-y-0 flex-col gap-0 overflow-hidden rounded-xl bg-surface-card/95 p-0 shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.07)] ring-0 backdrop-blur-2xl sm:max-w-[820px] md:top-14"
      >
        <DialogTitle className="sr-only">Search Relicto</DialogTitle>
        <div className="h-[2px] w-full shrink-0 bg-gradient-to-r from-status-live via-primary to-status-upcoming" />
        <PaletteBody
          key={session}
          initialQuery={initialQuery}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
