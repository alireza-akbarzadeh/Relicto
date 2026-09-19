import { cn } from "@/lib/cn";

type ProgressBarProps = {
  /** Filled share as a CSS width, e.g. "87.5%". */
  width: string;
  /** Track height and spacing, e.g. `h-2.5`. */
  className?: string;
  /** Gradient stops for the fill, e.g. `from-primary to-primary-container`. */
  fillClassName: string;
  label?: string;
};

export function ProgressBar({ width, className, fillClassName, label }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuetext={width}
      className={cn("w-full overflow-hidden rounded-full bg-surface-container-high", className)}
    >
      <div
        className={cn("h-full rounded-full bg-linear-to-r/srgb", fillClassName)}
        style={{ width }}
      />
    </div>
  );
}
