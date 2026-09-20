import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { MOD_TONE } from "../../lib/tones";
import type { ItemDetail } from "../../types";

/** Engine modifications the cosmetic ships with, plus the Valve canon quote. */
export function EngineMods({ mods }: { mods: ItemDetail["mods"] }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-card p-6 shadow-xl lg:col-span-7">
      <div>
        <span className="font-label-caps text-xs font-bold tracking-wider text-status-upcoming uppercase">{mods.eyebrow}</span>
        <h3 className="mt-1 font-headline-lg text-2xl font-bold text-text-primary">{mods.title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {mods.items.map((mod) => (
          <div key={mod.id} className="flex items-start gap-3 rounded border border-border-subtle bg-surface-container-lowest p-3">
            <Icon name={mod.icon} className={cn("mt-0.5 text-[22px]", MOD_TONE[mod.tone])} />
            <div>
              <span className="font-headline-sm text-xs font-bold text-text-primary">{mod.title}</span>
              <p className="mt-0.5 font-body-sm text-[11px] leading-relaxed text-text-muted">{mod.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-1 overflow-hidden rounded-lg border border-border-subtle bg-surface-container-lowest p-4">
        <div className="absolute -right-2 -bottom-4 font-display-hero text-[80px] text-on-surface-variant/10 select-none">&ldquo;</div>
        <span className="mb-1 block font-label-caps text-[10px] font-bold tracking-widest text-text-muted uppercase">OFFICIAL VALVE CANON ARCHIVE</span>
        <blockquote className="relative z-10 font-body-md text-xs leading-relaxed text-text-secondary italic">&ldquo;{mods.lore.quote}&rdquo;</blockquote>
        <div className="mt-3 flex items-center justify-between border-t border-border-subtle/40 pt-2 font-label-badge text-[10px] text-text-muted">
          <span>{mods.lore.source}</span>
          <span className="font-bold text-tertiary">{mods.lore.verified}</span>
        </div>
      </div>
    </div>
  );
}
