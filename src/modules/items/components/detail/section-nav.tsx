import { cn } from "@/lib/cn";
import type { SectionLink } from "../../types";

/** Sticky anchor nav under the hero. */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  return (
    <section className="sticky top-20 z-40 w-full border-y border-border-subtle bg-surface-deep/95 shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center overflow-x-auto px-4 lg:px-8">
        <nav className="flex items-center gap-2 py-2.5">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "rounded px-3 py-1.5 font-label-caps text-xs whitespace-nowrap transition-all",
                index === 0
                  ? "border border-border-tactical bg-surface-container-high font-bold tracking-wider text-tertiary"
                  : "text-text-muted hover:bg-surface-container hover:text-text-primary",
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
