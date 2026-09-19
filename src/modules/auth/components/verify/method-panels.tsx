"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { useCodeCells } from "../../hooks/use-code-cells";
import { useCodeCycle } from "../../hooks/use-code-cycle";

const CELL =
  "h-14 rounded-xl border-white/15 bg-surface-container-lowest text-center font-mono text-xl font-bold text-white uppercase shadow-inner transition-all focus-visible:border-rose-500 focus-visible:bg-auth-field-focus focus-visible:ring-2 focus-visible:ring-rose-500/20 sm:h-16 sm:text-2xl";

/** Steam Guard 5-character code with its rotating 30s window. */
export function CodePanel() {
  const { cells, register, onChange, onKeyDown, onPaste } = useCodeCells(["R", "9", "K", "4", "2"]);
  const { left, progress } = useCodeCycle(30, 18);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="font-display text-[11px] font-bold tracking-wider text-text-secondary uppercase">ENTER 5-CHARACTER STEAM GUARD CODE</span>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Icon name="sync" className="animate-spin text-[15px] [animation-duration:3s]" />
          <span className="font-mono text-xs font-bold">{left}s</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {cells.map((value, i) => (
          <Input
            key={i}
            ref={register(i)}
            value={value}
            onChange={onChange(i)}
            onKeyDown={onKeyDown(i)}
            onPaste={onPaste}
            aria-label={`Code character ${i + 1}`}
            inputMode="text"
            autoComplete="one-time-code"
            className={CELL}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-surface-container-lowest">
          <div
            className="h-full rounded-full bg-linear-to-r/srgb from-amber-500 via-rose-500 to-rose-600 transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
          <span>SYNC: VALVE STEAM UTC</span>
          <span className="text-text-secondary">Code refreshes in {left}s</span>
        </div>
      </div>
    </div>
  );
}

export function PushPanel() {
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-status-upcoming/25 bg-status-upcoming/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <Icon name="notifications_active" className="animate-bounce text-[28px] text-cyan-400" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-base font-bold text-white">App Notification Dispatched</h3>
        <p className="max-w-xs text-xs text-text-secondary">
          Open the Steam Mobile App on your authorized device and tap <span className="font-semibold text-white">Approve</span> to authenticate.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => toast("Push notification re-sent")}
        className="mt-1 h-auto rounded-lg border-white/10 bg-auth-raised px-4 py-2 text-xs font-semibold text-white hover:bg-auth-raised-hover"
      >
        Resend Push Notification
      </Button>
    </div>
  );
}

export function BackupPanel() {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="r-code" className="font-display text-[11px] font-bold tracking-wider text-text-secondary uppercase">SMS OR RECOVERY R-CODE</label>
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-white/10 bg-surface-container-lowest px-3.5 py-3 font-mono text-sm text-text-muted">R-</span>
        <Input
          id="r-code"
          placeholder="XXXXX-XXXXX"
          className="h-auto rounded-lg border-white/10 bg-surface-container-lowest px-4 py-3 font-mono text-sm text-white uppercase placeholder:text-text-muted focus-visible:border-rose-500 focus-visible:bg-auth-field-focus focus-visible:ring-0"
        />
      </div>
      <span className="text-xs text-text-muted">SMS was dispatched to +1 (***) ***-8842. Standard carrier rates may apply.</span>
    </div>
  );
}
