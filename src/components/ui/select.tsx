"use client";

import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export type SelectOption<T extends string> = { value: T; label: string };

type SelectProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  /** Classes for the closed trigger — pass the design's `<select>` classes so it renders identically. */
  triggerClassName?: string;
  /** Classes for the chevron; omit `icon` to render none (native-looking inline selects). */
  iconClassName?: string;
  icon?: boolean;
  label: string;
};

/**
 * Accessible listbox whose closed state is styled by the caller, so it can
 * reproduce a design's native `<select>` pixel for pixel.
 */
export function Select<T extends string>({
  value,
  onValueChange,
  options,
  triggerClassName,
  iconClassName,
  icon = true,
  label,
}: SelectProps<T>) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={(v) => onValueChange(v as T)}>
      <SelectPrimitive.Trigger aria-label={label} className={cn("relative text-left outline-hidden", triggerClassName)}>
        <SelectPrimitive.Value />
        {icon && (
          <SelectPrimitive.Icon asChild>
            <Icon name="expand_more" className={cn("pointer-events-none", iconClassName)} />
          </SelectPrimitive.Icon>
        )}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-[60] min-w-[var(--radix-select-trigger-width)] origin-[var(--radix-select-content-transform-origin)] data-[state=open]:animate-pop-in overflow-hidden rounded-xl border border-border-subtle bg-surface-card p-1 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 font-body-sm text-body-sm text-text-secondary outline-hidden select-none data-[highlighted]:bg-surface-container-high data-[highlighted]:text-text-primary data-[state=checked]:text-text-primary"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Icon name="check" className="text-[16px] text-primary" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
