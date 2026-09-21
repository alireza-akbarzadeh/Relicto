"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import type { GatewayMobile } from "../../data/gateway-mobile.mock";
import { useCodeCells } from "../../hooks/use-code-cells";
import { useCodeCycle } from "../../hooks/use-code-cycle";

/** Steam Guard push: device, rotating window and the five-character code. */
export function GuardTokenCard({ guard }: { guard: GatewayMobile["guard"] }) {
  const { left } = useCodeCycle(guard.period, guard.start);
  const { cells, register, onChange, onKeyDown, onPaste } = useCodeCells(guard.code);
  const firstEmpty = cells.findIndex((cell) => !cell);
  const active = firstEmpty === -1 ? cells.length - 1 : firstEmpty;

  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-status-live" />
          <h3 className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase">Steam Guard Mobile Token</h3>
        </div>
        <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-badge text-label-badge text-secondary">VALVE AUTH ACTIVE</span>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2 text-text-secondary">
        <div className="flex items-center gap-2">
          <Icon name="phonelink_ring" className="text-[18px] text-primary" />
          <span className="font-body-sm text-body-sm">{guard.device}</span>
        </div>
        <div className="font-data-mono-md text-data-mono-md text-status-live">{left}s</div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {cells.map((cell, index) => (
          <Input
            key={index}
            ref={register(index)}
            value={cell}
            onChange={onChange(index)}
            onKeyDown={onKeyDown(index)}
            onPaste={onPaste}
            inputMode="text"
            autoCapitalize="characters"
            maxLength={1}
            aria-label={`Steam Guard character ${index + 1}`}
            className={cn(
              "h-14 rounded-lg border-0 p-0 text-center font-data-mono-lg text-data-mono-lg shadow-inner focus-visible:ring-2 focus-visible:ring-border-focus md:text-data-mono-lg",
              index === active ? "animate-pulse bg-surface-bright text-primary dark:bg-surface-bright" : "bg-surface-deep text-text-primary dark:bg-surface-deep",
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between pt-1">
        <Button
          variant={null}
          size={null}
          onClick={() => toast("New code pushed", { description: guard.device })}
          className="h-auto gap-1 border-0 font-label-badge text-label-badge font-semibold text-text-secondary hover:text-text-primary"
        >
          <Icon name="refresh" className="text-[14px]" />
          <span>RESEND SMS / APP PUSH</span>
        </Button>
        <span className="font-label-badge text-label-badge text-tertiary">ENCRYPTED CHALLENGE</span>
      </div>
    </div>
  );
}
