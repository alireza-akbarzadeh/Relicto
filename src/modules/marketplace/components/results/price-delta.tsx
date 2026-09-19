import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDelta, trendOf } from "@/lib/format";
import { TREND_STYLE } from "../../lib/tones";

type PriceDeltaProps = { percent: number; window?: string; className?: string };

/** "+5.6% 7d" with a trend arrow; moves under ±1% read as flat. */
export function PriceDelta({ percent, window, className }: PriceDeltaProps) {
  const style = TREND_STYLE[trendOf(percent, 1)];
  return (
    <span className={cn("flex items-center gap-0.5 font-label-badge text-label-badge", style.text, className)}>
      <Icon name={style.icon} className="text-[12px]" /> {formatDelta(percent)}
      {window ? ` ${window}` : ""}
    </span>
  );
}
