"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

/** Floating panel in the app's card language (surface card, soft border, deep shadow). */
export function PopoverContent({
  className,
  align = "end",
  sideOffset = 10,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[60] rounded-xl border border-border-subtle bg-surface-card text-on-surface shadow-[0_16px_48px_rgba(0,0,0,0.55)] outline-hidden",
          "origin-[var(--radix-popover-content-transform-origin)] data-[state=open]:animate-pop-in",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
