"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { usePushSubscription, type PushState } from "../../hooks/use-push-subscription";

/** Device push opt-in, shown under the bell's header. Hidden where push can't work. */
export function PushToggle() {
  const { state, enable, disable } = usePushSubscription();
  const t = useTranslations("notifications");
  if (state === "unsupported") return null;

  const on = state === "on";

  const copy: Record<Exclude<PushState, "unsupported">, string> = {
    off: t("pushOff"),
    on: t("pushOn"),
    blocked: t("pushBlocked"),
    working: t("pushWorking"),
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          name={on ? "notifications_active" : "notifications"}
          className={cn("shrink-0 text-[16px]", on ? "text-status-upcoming" : "text-text-muted")}
        />
        <span className="text-[11px] leading-snug text-text-secondary">{copy[state]}</span>
      </div>
      {state !== "blocked" && (
        <Button
          variant={null}
          size={null}
          disabled={state === "working"}
          onClick={on ? disable : enable}
          className={cn(
            "h-auto shrink-0 rounded px-2 py-1 text-[11px] font-semibold transition-colors",
            on
              ? "text-text-muted hover:bg-white/5 hover:text-text-primary"
              : "bg-tertiary/15 text-tertiary hover:bg-tertiary/25",
          )}
        >
          {on ? t("turnOff") : t("turnOn")}
        </Button>
      )}
    </div>
  );
}
