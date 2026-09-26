"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";
import { createAlertRule } from "@/modules/alerts/actions/rules";

/**
 * "Ping me under $X" for this item. It deploys a real alert rule — the same
 * one /alerts creates — so the drop reaches the bell and any push device.
 */
export function PriceAlertCard({ itemName, defaultPrice }: { itemName: string; defaultPrice: string }) {
  const [price, setPrice] = useState(defaultPrice.replace(/[$,]/g, ""));
  const [pending, startTransition] = useTransition();

  const setPing = () => {
    const targetUsd = Number(price);
    if (!(targetUsd > 0)) return toast.error("Set a price above $0");
    startTransition(async () => {
      try {
        const { matched } = await createAlertRule({ name: itemName, targetUsd, maxFloat: null, autoBuy: false });
        toast.success(`Ping set at ${formatMoney(targetUsd)}`, {
          description: matched ? `You'll hear when ${itemName} lists at or under it. Manage it in Alerts.` : "Saved as a custom watch in Alerts.",
        });
      } catch {
        toast.error("Couldn't set the ping", { description: "Check your connection and try again." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-surface-container p-3">
      <div className="flex items-center gap-2">
        <Icon name="notification_add" className="text-[18px] text-tertiary" />
        <span className="font-headline-sm text-xs font-bold text-text-primary">Configure Price Drop Alerts</span>
      </div>
      <p className="font-body-sm text-[11px] text-text-muted">Get a bell and push notification the moment a listing drops under your price.</p>
      <div className="mt-0.5 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 font-data-mono-md text-xs text-text-muted">$</span>
          <Input
            value={price}
            inputMode="decimal"
            onChange={(event) => setPrice(event.target.value)}
            aria-label="Alert me below this price"
            className="h-auto rounded border-border-subtle bg-surface-container-lowest py-1.5 pr-2 pl-6 font-data-mono-md text-xs text-text-primary focus-visible:border-tertiary focus-visible:ring-1 focus-visible:ring-tertiary md:text-xs"
          />
        </div>
        <Button
          variant={null}
          size={null}
          disabled={pending}
          onClick={setPing}
          className="h-auto rounded border-border-subtle bg-surface-container-high px-4 py-1.5 font-label-caps text-xs font-bold text-text-primary transition-all hover:bg-tertiary hover:text-on-tertiary-container"
        >
          SET PING
        </Button>
      </div>
    </div>
  );
}
