"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type RecentSearchesProps = {
  entries: string[];
  onPick: (query: string) => void;
  onClear: () => void;
};

/** This browser's recent searches, one tap to run again. */
export function RecentSearches({
  entries,
  onPick,
  onClear,
}: RecentSearchesProps) {
  if (entries.length === 0) return null;
  return (
    <div className="rounded-lg bg-surface-deep/60 p-space-md shadow-sm">
      <div className="mb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="history" className="text-[16px] text-tertiary" />
          <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">
            Recent Intel Searches
          </span>
        </div>
        <Button
          variant={null}
          size={null}
          onClick={onClear}
          className="h-auto gap-1 rounded-none border-0 p-0 font-label-badge text-label-badge tracking-wider text-text-muted uppercase transition-colors hover:text-primary"
        >
          <Icon name="delete_sweep" className="text-[13px]" />
          <span>Clear History</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
          <Button
            key={entry}
            variant={null}
            size={null}
            onClick={() => onPick(entry)}
            className="group h-auto gap-2 rounded border-0 bg-surface-container-lowest px-2.5 py-1.5 font-body-sm text-body-sm font-normal text-text-primary transition-all hover:bg-surface-container"
          >
            <Icon
              name="trending_up"
              className="text-[15px] text-tertiary transition-transform group-hover:scale-110"
            />
            <span>{entry}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
