import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { WalletRail as WalletRailType } from "../types";

export function WalletRail({ rails, value, onChange }: { rails: WalletRailType[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-space-xs rounded-lg bg-surface-container-lowest p-1 sm:grid-cols-4">
      {rails.map((rail) => (
        <button
          key={rail.id}
          type="button"
          onClick={() => onChange(rail.id)}
          className={cn(
            "flex h-auto flex-col items-center gap-1 rounded px-1 py-2 font-label-caps text-[11px] uppercase transition-all",
            value === rail.id ? "bg-surface-container-high text-text-primary" : "text-text-muted hover:bg-surface-container-high/50 hover:text-text-primary",
          )}
        >
          <Icon name={rail.icon} className={cn("text-[16px]", value === rail.id && rail.id !== "crypto" && rail.id !== "usdt" ? "text-tertiary" : undefined)} />
          <span>{rail.label}</span>
        </button>
      ))}
    </div>
  );
}
