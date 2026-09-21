import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/mobile";
import type { DispatchChannel } from "../../mobile.types";

/** Where triggered alerts are delivered, with link health. */
export function DispatchChannels({ channels }: { channels: DispatchChannel[] }) {
  return (
    <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-md">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 font-headline-sm text-headline-sm text-text-primary">
          <Icon name="hub" className="text-[18px] text-tertiary" /> Tactical Dispatch Channels
        </h4>
        <span className="font-label-badge text-label-badge text-emerald-400 uppercase">
          {channels.length} / {channels.length} Healthy
        </span>
      </div>
      <div className="flex flex-col gap-space-xs">
        {channels.map((channel) => (
          <div key={channel.id} className="flex items-center justify-between rounded-lg bg-surface-card p-space-sm">
            <div className="flex items-center gap-2.5">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full bg-surface-container", TONE_TEXT[channel.tone])}>
                <Icon name={channel.icon} className="text-[16px]" />
              </div>
              <div>
                {/* The export adds text-[14px], but v3 lets text-headline-sm win. */}
                <div className="font-headline-sm text-headline-sm text-text-primary">{channel.title}</div>
                <div className="font-label-badge text-label-badge text-text-secondary">{channel.handle}</div>
              </div>
            </div>
            <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge text-emerald-400">{channel.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
