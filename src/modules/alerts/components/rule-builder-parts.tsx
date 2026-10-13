import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { CommunityTone } from "@/modules/community/types";

export const ALERTS_TONE: Record<CommunityTone, string> = {
  primary: "text-primary",
  cyan: "text-secondary",
  amber: "text-tertiary",
  muted: "text-text-muted",
  indigo: "text-indigo-500",
};

export function Condition({
  letter,
  title,
  detail,
  value,
  tone,
}: {
  letter: string;
  title: string;
  detail: string;
  value: string;
  tone: CommunityTone;
}) {
  return (
    <div className="flex flex-col justify-between gap-space-md rounded-lg bg-surface-container-low p-space-md md:flex-row md:items-center">
      <div className="flex items-center gap-space-md">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded bg-surface-container font-data-mono-md font-bold",
            ALERTS_TONE[tone],
          )}
        >
          {letter}
        </span>
        <div>
          <b className="block font-label-caps text-label-caps text-text-primary uppercase">{title}</b>
          <span className="text-xs text-text-secondary">{detail}</span>
        </div>
      </div>
      <span className={cn("font-data-mono-md text-xs font-bold", ALERTS_TONE[tone])}>{value}</span>
    </div>
  );
}

export function Gate() {
  return (
    <div className="-my-1 flex items-center justify-center gap-2">
      <span className="h-px w-12 bg-surface-container-highest" />
      <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-[10px] text-secondary">
        LOGIC GATE: [AND]
      </span>
      <span className="h-px w-12 bg-surface-container-highest" />
    </div>
  );
}

export function Action({
  title,
  icon,
  body,
  meta,
  tone,
}: {
  title: string;
  icon: "shopping_bag" | "notifications_active" | "sync_alt";
  body: string;
  meta: string;
  tone: CommunityTone;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-space-md">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-label-caps text-label-caps text-text-primary uppercase">
          <Icon name={icon} className={cn("text-[20px]", ALERTS_TONE[tone])} />
          {title}
        </span>
        <span className={cn("font-label-badge text-[10px] uppercase", ALERTS_TONE[tone])}>Enabled</span>
      </div>
      <p className="text-xs text-text-secondary">{body}</p>
      <span className="mt-auto font-data-mono-md text-[10px] text-tertiary">{meta}</span>
    </div>
  );
}
