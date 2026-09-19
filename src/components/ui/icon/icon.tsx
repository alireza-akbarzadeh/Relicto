import { cn } from "@/lib/cn";
import type { IconName } from "./icon-names";

type IconProps = {
  name: IconName;
  className?: string;
  /** Solid glyph (Material Symbols FILL axis). */
  filled?: boolean;
  /** Provide when the icon carries meaning on its own; otherwise it's decorative. */
  label?: string;
};

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

export function Icon({ name, className, filled, label }: IconProps) {
  return (
    <span
      className={cn("icon-symbol", className)}
      style={filled ? FILLED : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {name}
    </span>
  );
}
