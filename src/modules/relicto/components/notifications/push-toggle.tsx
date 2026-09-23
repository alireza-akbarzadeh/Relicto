"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { usePushSubscription, type PushState } from "../../hooks/use-push-subscription";

const COPY: Record<Exclude<PushState, "unsupported">, string> = {
  off: "Get alerts on this device when you buy or sell.",
  on: "This device is notified about your trades.",
  blocked: "Notifications are blocked in this browser's settings.",
  working: "Updating this device…",
};

/** Device push opt-in, shown under the bell's header. Hidden where push can't work. */
export function PushToggle() {
  const { state, enable, disable } = usePushSubscription();
  if (state === "unsupported") return null;

  const on = state === "on";

  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          name={on ? "notifications_active" : "notifications"}
          className={cn("shrink-0 text-[16px]", on ? "text-status-upcoming" : "text-text-muted")}
        />
        <span className="text-[11px] leading-snug text-text-secondary">{COPY[state]}</span>
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
          {on ? "Turn off" : "Turn on"}
        </Button>
      )}
    </div>
  );
}
