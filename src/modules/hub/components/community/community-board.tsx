import { MessageSquare } from "lucide-react";
import type { SellerIncentive, Thread } from "../../types";
import { SellerIncentiveCard } from "./seller-incentive";
import { ThreadRow } from "./thread-row";

type CommunityBoardProps = { threads: Thread[]; newThreads: number; incentive: SellerIncentive };

/** Community predictions next to the patch-surge seller incentive. */
export function CommunityBoard({ threads, newThreads, incentive }: CommunityBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="flex flex-col gap-4 rounded-xl border border-border-dark bg-surface-card p-6 shadow-xl lg:col-span-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-tertiary" />
            <h4 className="text-lg font-bold text-white">Community Craft &amp; Meta Predictions</h4>
          </div>
          <span className="rounded border border-status-upcoming/30 bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-status-upcoming uppercase">
            {newThreads} NEW THREADS
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {threads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} />
          ))}
        </div>
      </section>
      <SellerIncentiveCard incentive={incentive} />
    </div>
  );
}
