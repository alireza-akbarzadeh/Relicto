"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useTheme } from "@/hooks/use-theme";

type ThemeToggleProps = { className?: string; iconClassName?: string };

/** Sun / moon button that flips between the dark and light palettes. Style it per header family. */
export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const light = theme === "light";

  return (
    <Button
      variant={null}
      size={null}
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={light}
      title={light ? "Dark mode" : "Light mode"}
      className={cn("border-0 transition-colors", className)}
    >
      <Icon name={light ? "dark_mode" : "light_mode"} className={cn("text-[20px]", iconClassName)} />
    </Button>
  );
}
