"use client";

import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CHIP =
  "flex items-center gap-1 whitespace-nowrap rounded-lg bg-surface-container-low px-2.5 py-1 font-label-badge text-label-badge outline-hidden focus-visible:ring-2 focus-visible:ring-border-focus";

type ChipMenuProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
  className: string;
  children: ReactNode;
};

/** A filter chip that opens a single-choice menu (sort, price band). */
export function ChipMenu<T extends string>({ label, value, options, labels, onChange, className, children }: ChipMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={label} className={className}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {labels[option]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
