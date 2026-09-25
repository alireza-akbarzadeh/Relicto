"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useShare } from "../hooks/use-share";

type ShareButtonProps = {
  /** What is being shared, e.g. an item name. */
  title: string;
  text?: string;
  /** App-relative path, e.g. `/items/ak-vulcan`. */
  path: string;
  /** Shows the word "Share" beside the icon. */
  withLabel?: boolean;
  className?: string;
};

/**
 * Shares a link through the OS share sheet where there is one, else copies it.
 * The icon acknowledges a copy for a couple of seconds, since a clipboard write
 * is otherwise invisible.
 */
export function ShareButton({ title, text, path, withLabel = false, className }: ShareButtonProps) {
  const { share, justCopied } = useShare();

  return (
    <Button
      variant={null}
      size={null}
      onClick={() => void share({ title, text, path })}
      aria-label={`Share ${title}`}
      title="Share"
      className={cn(
        "h-auto rounded border-0 p-1 text-text-muted transition-colors hover:text-text-primary",
        justCopied && "text-status-upcoming",
        className,
      )}
    >
      <Icon name={justCopied ? "check" : "share"} className="text-[18px]" />
      {withLabel && <span className="ml-1.5 font-label-badge text-[11px] uppercase">{justCopied ? "Copied" : "Share"}</span>}
    </Button>
  );
}
