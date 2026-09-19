import { cn } from "@/lib/cn";

/** Horizontal rule with a centered pill label ("OR CONTINUE WITH …"). */
export function DividerLabel({ children, className, labelClassName }: { children: string; className?: string; labelClassName?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="h-px w-full bg-white/10" />
      <span
        className={cn(
          "absolute border border-white/5 bg-surface-card px-3 font-mono text-[10px] tracking-widest text-text-secondary uppercase",
          labelClassName,
        )}
      >
        {children}
      </span>
    </div>
  );
}
