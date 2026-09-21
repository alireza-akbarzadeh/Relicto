"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

/** Accept in the Steam app, or freeze the escrow and open a fraud ticket (confirmed first). */
export function TrackingActions({ offerUrl, code }: { offerUrl: string; code: string }) {
  const [open, setOpen] = useState(false);

  const freeze = () => {
    setOpen(false);
    toast.error("Escrow protocol paused", { description: `Valve API session for ${code} invalidated. Ticket #ESC-4091 opened with the fraud desk.` });
  };

  return (
    <div className="flex flex-col gap-space-sm pt-2">
      <a
        href={offerUrl}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-space-md py-3.5 font-headline-sm text-headline-sm tracking-wider text-white uppercase shadow-xl shadow-glow-crimson transition-all hover:bg-primary-container/90 active:scale-[0.98]"
      >
        <Icon name="send_to_mobile" className="text-[20px]" />
        <span>ACCEPT ON STEAM MOBILE</span>
      </a>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant={null}
              size={null}
              className="h-auto w-full gap-2 rounded-xl border-0 bg-surface-card px-space-md py-3 font-headline-sm text-headline-sm font-semibold tracking-wider text-text-muted uppercase transition-all hover:bg-surface-container-highest hover:text-primary active:scale-[0.98]"
            />
          }
        >
          <Icon name="gavel" className="text-[18px]" />
          <span>REPORT API MISMATCH / CANCEL</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Freeze this escrow?</AlertDialogTitle>
            <AlertDialogDescription>
              An emergency freeze invalidates the bot trade session and alerts the Relicto fraud escalation desk. Your funds stay locked in the vault.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep trading</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={freeze}>
              Freeze & report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
