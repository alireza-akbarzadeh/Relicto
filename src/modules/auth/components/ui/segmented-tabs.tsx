"use client";

import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";

export type SegmentedTab<T extends string> = { value: T; content: ReactNode };

type SegmentedTabsProps<T extends string> = {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** Classes for the tab list (grid, padding, surface). */
  listClassName: string;
  /** Classes for every tab; `data-active:` classes style the selected one. */
  tabClassName: string;
};

/** shadcn Tabs styled as the auth cards' segmented control. */
export function SegmentedTabs<T extends string>({ tabs, value, onChange, label, listClassName, tabClassName }: SegmentedTabsProps<T>) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as T)} className="gap-0">
      <TabsList aria-label={label} className={cn("h-auto w-full group-data-horizontal/tabs:h-auto", listClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className={cn("h-auto group-data-[variant=default]/tabs-list:data-active:shadow-xs", tabClassName)}>
            {tab.content}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
