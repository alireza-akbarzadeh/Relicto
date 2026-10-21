"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useAlertRules } from "../../state/alert-rules-provider";

const FIELD = "h-11 rounded-lg border-0 bg-canvas-base px-3 shadow-inner placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-border-focus md:text-body-md dark:bg-canvas-base";
const LABEL = "mb-1 block font-label-badge text-label-badge text-text-secondary uppercase";

type NewRuleSheetProps = { open: boolean; onOpenChange: (open: boolean) => void };

/** "Deploy Snipe Rule": name, target price, float cap and auto-buy; saves the rule and refreshes the feed. */
export function NewRuleSheet({ open, onOpenChange }: NewRuleSheetProps) {
  const t = useTranslations("alerts.mobile");
  const { create } = useAlertRules();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [float, setFloat] = useState("");
  const [autoBuy, setAutoBuy] = useState(false);

  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const target = Number(price);
    const cap = float.trim() ? Number(float) : null;
    if (!name.trim() || !(target > 0)) {
      toast.error(t("errNamePrice"));
      return;
    }
    if (cap !== null && !(cap >= 0 && cap <= 1)) {
      toast.error(t("errFloat"));
      return;
    }

    setPending(true);
    const saved = await create({ name: name.trim(), targetUsd: target, maxFloat: cap, autoBuy });
    setPending(false);
    if (!saved) return;

    toast.success(t("ruleDeployed"), { description: t("under", { name: name.trim(), price: formatMoney(target) }) });
    setName("");
    setPrice("");
    setFloat("");
    setAutoBuy(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[751px] gap-space-md overflow-y-auto rounded-t-2xl border-0 bg-surface-container-low p-space-md shadow-2xl">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-surface-variant" />
        <SheetHeader className="p-0">
          <span className="font-label-badge text-label-badge text-primary-container uppercase">{t("algoEngine")}</span>
          <SheetTitle className="font-headline-md text-headline-md text-text-primary">{t("deployRule")}</SheetTitle>
          <SheetDescription className="sr-only">{t("sheetDesc")}</SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-sm">
            <label>
              <span className={LABEL}>{t("targetSkin")}</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("targetSkinPlaceholder")} className={cn(FIELD, "font-body-md text-body-md text-text-primary")} />
            </label>
            <div className="grid grid-cols-2 gap-space-sm">
              <label>
                <span className={LABEL}>{t("targetPriceUsd")}</span>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" inputMode="decimal" placeholder="1250.00" className={cn(FIELD, "font-data-mono-md text-data-mono-md text-emerald-400")} />
              </label>
              <label>
                <span className={LABEL}>{t("maxFloat")}</span>
                <Input value={float} onChange={(e) => setFloat(e.target.value)} placeholder="< 0.035" className={cn(FIELD, "font-data-mono-md text-data-mono-md text-text-primary")} />
              </label>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface-card p-space-sm">
              <div>
                <div className="font-headline-sm text-headline-sm text-text-primary">{t("armAutoBuy")}</div>
                <div className="font-label-badge text-label-badge text-text-secondary">{t("armAutoBuySub")}</div>
              </div>
              <Button
                type="button"
                variant={null}
                size={null}
                role="switch"
                aria-checked={autoBuy}
                aria-label={t("armAutoBuy")}
                onClick={() => setAutoBuy((on) => !on)}
                className={cn("h-6 w-11 rounded-full border-0 p-0.5 transition-colors", autoBuy ? "justify-end bg-primary-container" : "justify-start bg-surface-variant")}
              >
                <span className="h-5 w-5 rounded-full bg-surface-dim shadow-md" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={pending}
            variant={null}
            size={null}
            className="h-12 w-full rounded-xl border-0 bg-primary-container font-headline-sm text-headline-sm font-semibold tracking-wider text-on-primary-container uppercase shadow-lg transition-all active:scale-95"
          >
            {t("deployMempool")}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/** Sticky "+ New Alert / Snipe Rule" button above the tab bar. */
export function NewRuleButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("alerts.mobile");
  return (
    <div className="sticky bottom-20 z-30 flex justify-center pt-2">
      <Button
        variant={null}
        size={null}
        onClick={onClick}
        className="h-12 w-full max-w-sm gap-2 rounded-xl border-0 bg-primary-container font-headline-sm text-headline-sm font-semibold tracking-wider text-on-primary-container uppercase shadow-2xl transition-all active:scale-95"
      >
        <Icon name="add_circle" className="text-[20px]" /> {t("newRuleBtn")}
      </Button>
    </div>
  );
}
