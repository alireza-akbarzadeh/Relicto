import { PingDot } from "@/components/ui/dot";
import type { RadarMatch } from "../../../mobile.types";
import { SectionHeading } from "../section-heading";
import { RadarMatchCard } from "./radar-match-card";

type RadarFeedProps = { section: { title: string; meta: string }; matches: RadarMatch[] };

export function RadarFeed({ section, matches }: RadarFeedProps) {
  return (
    <section>
      <SectionHeading
        className="px-margin pt-6 pb-2"
        leading={<PingDot sizeClassName="h-2 w-2" colorClassName="bg-status-live" />}
        title={section.title}
        meta={<span className="font-label-badge text-label-badge text-text-muted uppercase">{section.meta}</span>}
      />
      <div className="flex flex-col gap-2.5 px-margin">
        {matches.map((match) => (
          <RadarMatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
