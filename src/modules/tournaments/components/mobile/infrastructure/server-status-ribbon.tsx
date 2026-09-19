import { Icon } from "@/components/ui/icon";
import type { ServerStatus } from "../../../mobile.types";

export function ServerStatusRibbon({ status }: { status: ServerStatus }) {
  return (
    <div className="px-margin pt-4">
      <div className="flex items-center justify-between rounded-lg bg-surface-container-high/60 p-3 shadow-inner backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-deep">
            <Icon name={status.icon} className="text-[18px] text-status-upcoming" />
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-text-primary uppercase">{status.title}</span>
            <span className="font-body-sm text-xs text-text-secondary">{status.description}</span>
          </div>
        </div>
        <span className="font-data-mono-md text-xs font-semibold text-status-upcoming">{status.ping}</span>
      </div>
    </div>
  );
}
