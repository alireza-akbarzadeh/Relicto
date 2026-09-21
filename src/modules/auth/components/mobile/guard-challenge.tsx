"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import type { VerifyMobile } from "../../data/verify-mobile.mock";
import { useCodeCycle } from "../../hooks/use-code-cycle";

type CodeCells = {
  cells: string[];
  register: (i: number) => (el: HTMLInputElement | null) => void;
  onChange: (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  fill: (value: string) => void;
};

/** Code cells, clipboard paste and the rolling 30s window ring. */
export function GuardChallenge({ data, code }: { data: VerifyMobile; code: CodeCells }) {
  const { left, progress } = useCodeCycle(data.period, data.start);
  const last = code.cells.length - 1;

  const paste = async () => {
    try {
      const text = (await navigator.clipboard.readText()).replace(/\s/g, "").toUpperCase();
      if (!text) throw new Error("empty");
      code.fill(text);
    } catch {
      toast.error("Nothing to paste", { description: "Copy the 5-character code from Steam Mobile first." });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center px-space-md">
        <div className="my-space-xs flex w-full max-w-sm items-center justify-between gap-space-xs">
          {code.cells.map((cell, index) => (
            <div key={index} className="relative flex h-14 flex-1 items-center justify-center rounded-lg bg-surface-container-high shadow-md transition-all focus-within:bg-surface-bright">
              <Input
                ref={code.register(index)}
                value={cell}
                onChange={code.onChange(index)}
                onKeyDown={code.onKeyDown(index)}
                onPaste={code.onPaste}
                maxLength={1}
                autoCapitalize="characters"
                aria-label={`Code character ${index + 1}`}
                className={cn(
                  "h-full w-full rounded-lg border-0 bg-transparent p-0 text-center font-data-mono-lg text-data-mono-lg uppercase focus-visible:ring-0 md:text-data-mono-lg dark:bg-transparent",
                  index === last ? "font-bold text-primary" : "text-text-primary",
                )}
              />
              {index === last && <span className="absolute bottom-2 left-1/2 h-0.5 w-4 -translate-x-1/2 animate-pulse rounded-full bg-primary" />}
            </div>
          ))}
        </div>
        <Button
          variant={null}
          size={null}
          onClick={paste}
          className="mt-space-sm h-auto gap-1.5 rounded-full border-0 bg-surface-container px-space-md py-1.5 text-text-secondary shadow-xs transition hover:text-text-primary active:scale-95"
        >
          <Icon name="content_paste" className="text-[16px] text-tertiary" />
          <span className="font-label-badge text-label-badge font-semibold tracking-wider uppercase">Paste Steam Code</span>
        </Button>
      </div>

      <div className="mt-space-md px-space-md">
        <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container p-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36" aria-hidden>
                <circle className="text-surface-container-highest" cx="18" cy="18" fill="none" r="14" stroke="currentColor" strokeWidth="3" />
                <circle
                  className="text-tertiary transition-all duration-1000 ease-linear"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  stroke="currentColor"
                  strokeDasharray="88"
                  strokeDashoffset={88 - progress * 88}
                  strokeLinecap="round"
                  strokeWidth="3.2"
                />
              </svg>
              <Icon name="schedule" className="absolute text-[15px] text-tertiary" />
            </div>
            <div className="flex flex-col">
              <span className="font-data-mono-md text-data-mono-md font-medium text-text-primary">
                Code expires in <span className="font-bold text-tertiary">{left}s</span>
              </span>
              <span className="font-body-sm text-body-sm text-text-muted">Steam rolling {data.period}s token</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[
              { icon: "send_to_mobile" as const, label: "Resend push", notice: "A fresh approval was pushed to your phone." },
              { icon: "sms" as const, label: "SMS backup", notice: "A backup code was sent by SMS." },
            ].map((action) => (
              <Button
                key={action.icon}
                variant={null}
                size={null}
                aria-label={action.label}
                onClick={() => toast(action.label, { description: action.notice })}
                className="h-8 w-8 rounded-lg border-0 bg-surface-container-high text-text-secondary transition hover:text-text-primary active:scale-95"
              >
                <Icon name={action.icon} className="text-[17px]" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
