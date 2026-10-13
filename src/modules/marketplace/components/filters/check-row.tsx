import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";

type CheckMarkProps = { checked: boolean; checkedClassName: string; size?: "sm" | "md" };

/** The design's square check: a filled tile with ✓, or an empty well. */
export function CheckMark({ checked, checkedClassName, size = "sm" }: CheckMarkProps) {
  const box = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  if (!checked) return <span aria-hidden className={cn(box, "rounded bg-surface-container-high")} />;
  return (
    <span aria-hidden className={cn(box, "flex items-center justify-center rounded text-[11px] font-bold", checkedClassName)}>
      ✓
    </span>
  );
}

type CheckRowProps = {
  checked: boolean;
  onChange: () => void;
  className?: string;
  children: ReactNode;
};

/** Label + visually hidden checkbox, so the custom mark stays keyboard accessible. */
export function CheckRow({ checked, onChange, className, children }: CheckRowProps) {
  return (
    <label className={cn("cursor-pointer has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-border-focus", className)}>
      <Checkbox className="sr-only" checked={checked} onCheckedChange={() => onChange()} />
      {children}
    </label>
  );
}
