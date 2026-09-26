import { Fragment } from "react";

const KEYS = [
  { key: "↑↓", label: "Navigate" },
  { key: "↵ Enter", label: "Open" },
  { key: "Tab", label: "Quick Basket" },
  { key: "Esc", label: "Close" },
];

/** Key legend, and what the last answer actually cost — measured, not decorative. */
export function SearchFooter({
  tookMs,
  results,
}: {
  tookMs: number | null;
  results: number;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 border-t border-surface-container-high/40 bg-surface-container-lowest/95 px-space-md py-2.5 text-text-muted sm:flex-row md:px-space-lg">
      <div className="flex items-center gap-3 overflow-x-auto font-label-badge text-[11px] text-nowrap">
        {KEYS.map((entry, index) => (
          <Fragment key={entry.key}>
            {index > 0 && (
              <span className="text-surface-container-high">•</span>
            )}
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-surface-container px-1.5 py-0.5 font-data-mono-md font-bold text-text-secondary">
                {entry.key}
              </kbd>
              <span>{entry.label}</span>
            </span>
          </Fragment>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-2 font-label-badge text-[11px] text-text-secondary">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-upcoming" />
          <span>
            {results} result{results === 1 ? "" : "s"}
          </span>
        </div>
        {tookMs !== null && (
          <>
            <span className="text-surface-container-high">|</span>
            <span className="font-data-mono-md text-status-upcoming">
              {tookMs}ms query
            </span>
          </>
        )}
      </div>
    </div>
  );
}
