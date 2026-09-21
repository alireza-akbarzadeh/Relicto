"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { outcomeGain } from "../../lib/trade-up";
import type { Outcome } from "../../mobile.types";

type ForgeResultDialogProps = { result: Outcome | null; input: number; bot: string; onCollect: () => void };

/** Contract result reveal after Ignite. */
export function ForgeResultDialog({ result, input, bot, onCollect }: ForgeResultDialogProps) {
  const collect = () => {
    if (result) toast.success(`${result.name} added to your Relicto vault`);
    onCollect();
  };

  return (
    <Dialog open={result !== null} onOpenChange={(open) => !open && onCollect()}>
      <DialogContent showCloseButton={false} className="flex max-w-sm flex-col items-center overflow-hidden rounded-xl border-0 bg-surface-card p-space-lg text-center shadow-2xl">
        {result && (
          <>
            <div className="mb-space-sm flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-primary-container text-on-primary shadow-lg">
              <Icon name="military_tech" className="text-[32px]" />
            </div>
            <span className="font-label-badge text-label-badge text-tertiary uppercase">Contract Executed</span>
            <DialogTitle className="mt-1 font-headline-lg-mobile text-headline-lg-mobile text-text-primary">{result.name}</DialogTitle>
            <span className="mt-1 font-data-mono-lg text-data-mono-lg text-tertiary">
              {formatMoney(result.valueUsd)} Value ({outcomeGain(result, input)} ROI)
            </span>
            <DialogDescription className="mt-2 font-body-sm text-body-sm text-text-secondary">
              Trade offer accepted by {bot}. Added to your Relicto hot vault.
            </DialogDescription>
            <Button
              variant={null}
              size={null}
              onClick={collect}
              className="mt-space-md h-auto w-full rounded-xl border-0 bg-primary-container py-2.5 font-headline-sm text-body-md font-normal text-on-primary"
            >
              Collect to Inventory
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
