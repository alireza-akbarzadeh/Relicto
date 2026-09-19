import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TEXT_TONE } from "../../../lib/tones";
import type { BentoItem } from "../../../mobile.types";
import { SectionHeading } from "../section-heading";

type InfrastructureBentoProps = { title: string; items: BentoItem[] };

/** 2×2 grid of platform capabilities. */
export function InfrastructureBento({ title, items }: InfrastructureBentoProps) {
  return (
    <section className="px-margin pt-6 pb-2">
      <SectionHeading
        className="mb-3 justify-start"
        leading={<Icon name="shield" className="text-[20px] text-text-secondary" />}
        title={title}
      />
      <ul className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <li key={item.title} className="flex flex-col justify-between rounded-lg bg-surface-card p-3 shadow-xs">
            <Icon name={item.icon} className={cn("mb-2 text-[22px]", TEXT_TONE[item.tone])} />
            <div>
              <span className="block font-headline-sm text-sm font-semibold text-text-primary">{item.title}</span>
              <span className="mt-0.5 block font-body-sm text-xs leading-relaxed text-text-secondary">
                {item.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
