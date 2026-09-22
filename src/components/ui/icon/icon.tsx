import { cn } from "@/lib/cn";
import { ICON_MAP } from "./icon-map";
import type { IconName } from "./icon-names";

type IconProps = {
  name: IconName;
  className?: string;
  /** Solid glyph — sets fill to the current text color. */
  filled?: boolean;
  /** Provide when the icon carries meaning on its own; otherwise it's decorative. */
  label?: string;
};

export function Icon({ name, className, filled, label }: IconProps) {
  const Glyph = ICON_MAP[name];
  return (
    <Glyph
      className={cn("icon-symbol", className)}
      fill={filled ? "currentColor" : "none"}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
