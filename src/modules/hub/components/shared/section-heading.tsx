import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/tones";
import type { Tone } from "../../types";

type SectionHeadingProps = {
  icon: LucideIcon;
  eyebrow: string;
  tone: Tone;
  title: string;
  /** `lg` grows the title from `sm` up. */
  size?: "md" | "lg";
  tracking?: "wider" | "widest";
};

/** Mono eyebrow with icon above a section title. */
export function SectionHeading({ icon: Glyph, eyebrow, tone, title, size = "md", tracking = "wider" }: SectionHeadingProps) {
  return (
    <div>
      <div className={cn("flex items-center gap-2", TONE_TEXT[tone])}>
        <Glyph className="size-4" />
        <span className={cn("font-mono text-[10px] font-bold uppercase", tracking === "widest" ? "tracking-widest" : "tracking-wider")}>
          {eyebrow}
        </span>
      </div>
      <h3 className={cn("text-xl font-bold tracking-tight text-white", size === "lg" && "sm:text-2xl")}>{title}</h3>
    </div>
  );
}
