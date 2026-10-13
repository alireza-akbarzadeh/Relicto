"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";

export function Composer({
  draft,
  setDraft,
  onBroadcast,
  isPending = false,
  initials = "TR",
}: {
  draft: string;
  setDraft: (value: string) => void;
  onBroadcast: () => void;
  isPending?: boolean;
  initials?: string;
}) {
  return (
    <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
      <div className="flex gap-space-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container font-headline-sm text-headline-sm text-on-primary-container">
          {initials}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-space-sm">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Share a trade-up clip, market arbitrage theory, or broadcast a direct P2P offer..."
            rows={2}
            className="resize-none border-0 bg-surface-container text-text-primary placeholder:text-text-muted focus-visible:bg-surface-container-high"
          />
          <div className="flex flex-wrap items-center justify-between gap-space-xs">
            <div className="flex gap-space-xs">
              <Link
                href="/sell"
                className="flex h-auto cursor-pointer items-center gap-1 rounded bg-surface-container px-2 py-1 font-label-badge text-label-badge text-tertiary uppercase transition-colors hover:bg-surface-container-high"
              >
                <Icon name="monetization_on" className="text-[16px]" />
                <span>Attach Skin</span>
              </Link>
              <Link
                href="/tracker"
                className="flex h-auto cursor-pointer items-center gap-1 rounded bg-surface-container px-2 py-1 font-label-badge text-label-badge text-status-upcoming uppercase transition-colors hover:bg-surface-container-high"
              >
                <Icon name="query_stats" className="text-[16px]" />
                <span>Chart Signal</span>
              </Link>
            </div>
            <Button
              onClick={onBroadcast}
              disabled={isPending || !draft.trim()}
              className="h-auto rounded bg-primary-container px-space-md py-1.5 font-headline-sm text-headline-sm text-on-primary-container uppercase transition-transform active:scale-95 disabled:opacity-50"
            >
              {isPending ? "Broadcasting..." : "Broadcast"}{" "}
              <Icon name="send" className="text-[16px]" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
