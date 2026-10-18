import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckMarkProps = { checked: boolean; checkedClassName: string; size?: "sm" | "md" };

/** The design's square check: a filled tile with ✓, or an empty bordered well. */
export function CheckMark({ checked, checkedClassName, size = "sm" }: CheckMarkProps) {
  const box = size === "sm" ? "w-4 h-4" : "w-4.5 h-4.5";
  if (!checked) {
    return (
      <span
        aria-hidden
        className={cn(
          box,
          "shrink-0 rounded border border-white/20 bg-surface-container-high transition-colors group-hover:border-white/40",
        )}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        box,
        "flex shrink-0 items-center justify-center rounded text-[11px] font-bold shadow-xs",
        checkedClassName,
      )}
    >
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

/** Label + visually hidden checkbox, so the custom mark stays keyboard accessible without breaking flex layout. */
export function CheckRow({ checked, onChange, className, children }: CheckRowProps) {
  return (
    <label className={cn("relative cursor-pointer select-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-border-focus", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}
      />
      {children}
    </label>
  );
}
