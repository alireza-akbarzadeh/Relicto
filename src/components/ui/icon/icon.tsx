import { cn } from "@/lib/cn";
import type { IconName } from "./icon-names";

type IconProps = {
  name: IconName;
  className?: string;
  /** Provide when the icon carries meaning on its own; otherwise it's decorative. */
  label?: string;
};

export function Icon({ name, className, label }: IconProps) {
  return (
    <span
      className={cn("icon-symbol", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {name}
    </span>
  );
}
