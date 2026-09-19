import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  leading: ReactNode;
  title: string;
  meta?: ReactNode;
  className?: string;
};

/** Mobile section title row: icon or dot, uppercase title, optional meta on the right. */
export function SectionHeading({ leading, title, meta, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        {leading}
        <h2 className="font-headline-sm text-headline-sm font-semibold tracking-wide text-text-primary uppercase">
          {title}
        </h2>
      </div>
      {meta}
    </div>
  );
}
