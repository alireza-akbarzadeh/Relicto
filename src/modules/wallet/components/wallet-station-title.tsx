import { Icon } from "@/components/ui/icon";

export function StationTitle({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: "account_balance" | "bolt";
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="flex items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-xs">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <Icon name={icon} className="text-[20px]" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-text-primary">
            {title}
          </h3>
          <span className="font-label-badge text-label-badge text-text-muted">
            {subtitle}
          </span>
        </div>
      </div>
      <span className="rounded bg-primary-container/20 px-2 py-1 font-label-badge text-[11px] text-primary-container">
        {badge}
      </span>
    </div>
  );
}

/** Says out loud that nothing is charged here — deposits are simulated until a payment provider is connected. */
export function TestModeStrip() {
  return (
    <div className="flex items-center gap-space-xs rounded-lg bg-status-upcoming/10 px-space-sm py-2 font-body-sm text-[11px] text-status-upcoming">
      <Icon name="info" className="text-[14px]" />
      <span>
        Test mode: deposits are credited instantly and nothing is charged. No
        payment provider is connected yet.
      </span>
    </div>
  );
}
