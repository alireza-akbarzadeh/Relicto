"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_STROKE, TONE_TEXT } from "../../lib/mobile";
import type { AlertRule } from "../../mobile.types";
import { useAlertRules } from "../../state/alert-rules-provider";

const LABEL = "font-label-badge text-label-badge text-text-secondary uppercase";

function ArmSwitch({ rule }: { rule: AlertRule }) {
  const { toggle } = useAlertRules();
  return (
    <Button
      variant={null}
      size={null}
      role="switch"
      aria-checked={rule.armed}
      aria-label={`Arm ${rule.name}`}
      onClick={() => toast(toggle(rule.id) ? "Sniper rule armed & live" : "Rule paused", { description: rule.name })}
      className={cn(
        "h-6 w-11 shrink-0 rounded-full border-0 p-0.5 shadow-inner transition-colors",
        rule.armed ? "justify-end bg-primary-container" : "justify-start bg-surface-variant",
      )}
    >
      <span className="h-5 w-5 rounded-full bg-surface-dim shadow-md" />
    </Button>
  );
}

function PingButton({ message }: { message: string }) {
  const [polling, setPolling] = useState(false);
  const ping = () => {
    setPolling(true);
    setTimeout(() => {
      setPolling(false);
      toast.success(message);
    }, 450);
  };
  return (
    <Button
      variant={null}
      size={null}
      onClick={ping}
      disabled={polling}
      className="h-auto gap-1 rounded-lg border-0 bg-surface-container px-2.5 py-1 font-label-badge text-label-badge font-semibold text-text-primary transition-all hover:bg-surface-variant disabled:opacity-100"
    >
      <Icon name={polling ? "sync" : "cell_tower"} className={cn("text-[13px]", polling ? "animate-spin text-emerald-400" : "text-tertiary")} />
      {polling ? "Polling..." : "Test Ping"}
    </Button>
  );
}

/** One trigger rule: asset, arm switch, target vs current, monitor or batch progress, channels and ping. */
export function RuleCard({ rule }: { rule: AlertRule }) {
  const { current, monitor, progress } = rule;
  return (
    <article className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex min-w-0 items-center gap-space-sm">
          <Image src={rule.image} alt={rule.imageAlt} width={96} height={96} sizes="48px" className="h-12 w-12 shrink-0 rounded-lg bg-surface-dim object-cover" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-label-badge text-label-badge">
              <span className={cn("font-semibold", TONE_TEXT[rule.game.tone])}>{rule.game.label}</span>
              <span className="text-text-muted">|</span>
              <span className={TONE_TEXT[rule.category.tone]}>{rule.category.label}</span>
            </div>
            <h3 className="truncate font-headline-sm text-headline-sm text-text-primary">{rule.name}</h3>
          </div>
        </div>
        <ArmSwitch rule={rule} />
      </div>

      <div className="mt-space-md flex items-center justify-between rounded-lg bg-surface-card p-space-sm">
        <div>
          <span className={LABEL}>{rule.target.label}</span>
          <div className={cn("font-data-mono-md text-data-mono-md font-bold", TONE_TEXT[rule.target.tone])}>{rule.target.value}</div>
        </div>
        <div className="text-right">
          <span className={LABEL}>{current.label}</span>
          <div className={cn("font-data-mono-md text-data-mono-md", TONE_TEXT[current.tone], current.bold && "font-bold", current.live && "flex items-center gap-1")}>
            {current.live && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-upcoming" />}
            {current.value}
            {current.delta && (
              <>
                {" "}
                <span className="font-body-sm text-error">{current.delta}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {monitor && (
        <div className="mt-space-sm flex items-center justify-between py-1">
          <div className="flex items-center gap-1.5">
            <Icon name={monitor.icon} className={cn("text-[16px]", TONE_TEXT[monitor.iconTone])} />
            <span className={cn("font-label-badge text-label-badge font-medium uppercase", TONE_TEXT[monitor.labelTone])}>{monitor.label}</span>
          </div>
          <div className="h-6 w-28">
            <svg className={cn("h-full w-full", TONE_STROKE[monitor.sparkTone])} fill="none" preserveAspectRatio="none" viewBox="0 0 100 24" aria-hidden>
              <path d={monitor.spark} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-label-badge text-label-badge text-text-muted">{monitor.stat}</span>
        </div>
      )}

      {progress && (
        <div className="mt-space-sm">
          <div className="flex justify-between pb-1 font-label-badge text-label-badge text-text-secondary">
            <span>{progress.label}</span>
            <span className="text-text-primary">{progress.value}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full bg-tertiary" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      )}

      <div className="mt-space-sm flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-1">
          {rule.tags.map((tag) => (
            <span
              key={tag.label}
              className={cn("rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge", TONE_TEXT[tag.tone], tag.icon && "flex items-center gap-1")}
            >
              {tag.icon && <Icon name={tag.icon} className="text-[11px]" />} {tag.label}
            </span>
          ))}
        </div>
        <PingButton message={rule.ping} />
      </div>
    </article>
  );
}
