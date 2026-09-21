"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type MobileBackButtonProps = {
  /** Where to go when the page was opened directly (no history to pop). */
  fallback: string;
  className?: string;
  iconClassName?: string;
  icon?: "arrow_back" | "arrow_back_ios_new";
};

/** Header back arrow: pops history, or falls back to a parent route. */
export function MobileBackButton({ fallback, className, iconClassName, icon = "arrow_back" }: MobileBackButtonProps) {
  const router = useRouter();

  const back = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallback);
  };

  return (
    <Button
      variant={null}
      size={null}
      aria-label="Go back"
      onClick={back}
      className={cn("h-11 w-11 border-0 transition-colors", className)}
    >
      <Icon name={icon} className={cn("text-[20px]", iconClassName)} />
    </Button>
  );
}
