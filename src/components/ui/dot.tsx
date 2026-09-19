import { cn } from "@/lib/cn";

const ANIMATION = { ping: "animate-ping", pulse: "animate-pulse" } as const;

type DotProps = {
  /** Size and color, e.g. `w-2 h-2 bg-status-live`. */
  className?: string;
  animation?: keyof typeof ANIMATION;
};

/** Small status indicator dot. */
export function Dot({ className, animation }: DotProps) {
  return (
    <span aria-hidden className={cn("rounded-full", animation && ANIMATION[animation], className)} />
  );
}

type PingDotProps = {
  /** Size of the dot, e.g. `h-2 w-2`. */
  sizeClassName: string;
  /** Background color of both the dot and its halo. */
  colorClassName: string;
  className?: string;
};

/** A solid dot with an expanding halo behind it, for "live" states. */
export function PingDot({ sizeClassName, colorClassName, className }: PingDotProps) {
  return (
    <span aria-hidden className={cn("relative flex", sizeClassName, className)}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          colorClassName,
        )}
      />
      <span className={cn("relative inline-flex rounded-full", sizeClassName, colorClassName)} />
    </span>
  );
}
