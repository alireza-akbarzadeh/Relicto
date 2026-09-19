type ArenaSectionHeaderProps = {
  section: { kicker: string; title: string; openEvents: number; seeding: string };
};

export function ArenaSectionHeader({ section }: ArenaSectionHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
      <div className="flex flex-col">
        <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase">
          {section.kicker}
        </span>
        <h2 id="active-arenas" className="font-headline-lg text-headline-lg tracking-tight text-text-primary uppercase">
          {section.title}
        </h2>
      </div>
      <div className="flex items-center gap-space-xs font-label-badge text-label-badge text-text-muted">
        <span>SHOWING {section.openEvents} OPEN EVENTS</span>
        <span aria-hidden className="text-surface-bright">
          •
        </span>
        <span className="font-bold text-tertiary">{section.seeding}</span>
      </div>
    </div>
  );
}
