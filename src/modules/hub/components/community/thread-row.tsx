import { ChevronRight, ThumbsUp } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/tones";
import type { Thread } from "../../types";

/**
 * A community discussion teaser; the whole row opens the thread in community discussions.
 */
export function ThreadRow({ thread }: { thread: Thread }) {
  return (
    <LinkButton
      href={`/community?channel=${encodeURIComponent(thread.channel.label)}`}
      className="w-full cursor-pointer justify-between gap-4 rounded-lg border-border-dark bg-surface p-4 text-left leading-normal font-normal whitespace-normal transition-colors hover:border-surface-bright"
    >
      <span className="flex items-start gap-3.5">
        <span className="flex flex-col items-center rounded-md border border-border-dark bg-surface-card px-2.5 py-1.5">
          <ThumbsUp className="size-3.5 text-primary" />
          <span className="mt-1 font-mono text-xs font-bold text-white">{thread.votes}</span>
        </span>
        <span className="block">
          <span className="block text-sm font-bold text-white">{thread.title}</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">{thread.excerpt}</span>
          <span className="mt-2 flex items-center gap-2 font-mono text-[10px] text-text-secondary">
            <span>BY: {thread.author}</span>
            <span>•</span>
            <span>{thread.age} AGO</span>
            <span>•</span>
            <span className={cn("font-semibold", TONE_TEXT[thread.channel.tone])}>{thread.channel.label}</span>
          </span>
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-text-muted" />
    </LinkButton>
  );
}
