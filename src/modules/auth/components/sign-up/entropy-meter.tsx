import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { PasswordStrength } from "../../lib/password-strength";

/** Four-segment bar filled by score; the fourth segment glows emerald once strong. */
const SEGMENTS = ["bg-status-upcoming", "bg-primary-container", "bg-tertiary", "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"];

export function EntropyMeter({ strength }: { strength: PasswordStrength }) {
  const filled = strength.score / 25;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-surface-deep/80 p-3.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-label-caps text-[11px] font-semibold tracking-wider text-text-muted uppercase">Vault Entropy Security Matrix</span>
        <span className="font-data-mono-md text-[11px] font-bold text-tertiary">
          {strength.label}: {strength.score}% Cryptographic Entropy
        </span>
      </div>
      <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-surface-container-highest">
        {SEGMENTS.map((tone, i) => {
          const fill = Math.max(0, Math.min(1, filled - i));
          return fill > 0 ? (
            <div key={tone} className={cn("h-full rounded-full", tone)} style={{ width: `${fill * 25}%` }} />
          ) : null;
        })}
      </div>
      <div className="mt-0.5 flex flex-wrap gap-1.5">
        {strength.rules.map((rule) => (
          <span
            key={rule.id}
            className={cn(
              "flex items-center gap-1 rounded border px-2 py-0.5 font-label-badge text-[10px] font-semibold",
              rule.passed ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-400" : "border-white/10 bg-surface-container text-text-muted",
            )}
          >
            <Icon name={rule.passed ? "done" : "close"} className="text-[11px]" /> {rule.label}
          </span>
        ))}
      </div>
    </div>
  );
}
