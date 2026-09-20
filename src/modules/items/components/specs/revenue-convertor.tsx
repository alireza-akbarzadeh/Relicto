import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { STAT_TONE } from "../../lib/tones";
import type { SellConversion } from "../../types";

/** "Own this in your backpack?" — fee maths and a one-click listing CTA. */
export function RevenueConvertor({ item, sell }: { item: string; sell: SellConversion }) {
  return (
    <section
      id="sell-flow"
      className="relative w-full scroll-mt-40 overflow-hidden rounded-lg border border-border-subtle bg-linear-to-r/srgb from-surface-card via-surface-container-high to-surface-card p-6 shadow-2xl"
    >
      <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-5">
        <Icon name="swap_horiz" className="text-[240px] text-tertiary" />
      </div>
      <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-2 lg:col-span-5">
          <div className="flex items-center gap-2">
            <Icon name="currency_exchange" className="text-[20px] text-tertiary" />
            <span className="font-label-caps text-xs font-bold tracking-wider text-tertiary">SELLER REVENUE CONVERTOR</span>
          </div>
          <h3 className="font-headline-lg text-2xl leading-tight font-bold text-text-primary">Own this Arcana in your Steam Backpack?</h3>
          <p className="font-body-md text-xs leading-relaxed text-text-secondary">
            List it seamlessly on Relicto. We take only 3% (compared to Steam&apos;s 15% wallet lock-in fee), and payout instantly to your linked crypto, card, or
            PayPal balance.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 font-body-sm text-xs text-text-muted">
              <Icon name="verified" className="text-[18px] text-emerald-400" />
              <span>Zero-Password Auth</span>
            </div>
            <div className="flex items-center gap-1.5 font-body-sm text-xs text-text-muted">
              <Icon name="bolt" className="text-[18px] text-tertiary" />
              <span>30-Sec Listing Speed</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border-subtle bg-surface-container-lowest/90 p-4 shadow-xl backdrop-blur-xl sm:flex-row lg:col-span-7">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-card p-2">
            <Image src={sell.image} alt={sell.imageAlt} width={512} height={279} sizes="96px" className="h-auto w-auto max-h-full max-w-full object-contain" />
          </div>
          <div className="flex w-full flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-sm font-bold text-text-primary">{item}</span>
                <span className="rounded border border-emerald-500/30 bg-emerald-950/80 px-1.5 font-label-badge text-[9px] font-bold text-emerald-400">
                  {sell.detected}
                </span>
              </div>
              <span className="font-data-mono-md text-[10px] text-text-secondary">{sell.style}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded border border-border-subtle/50 bg-surface-container p-2 text-center">
              {sell.rows.map((row) => (
                <div key={row.label}>
                  <span className="block font-label-badge text-[9px] text-text-muted">{row.label}</span>
                  <span className={cn("font-data-mono-md text-xs", row.tone === "primary" ? "font-bold" : row.tone === "emerald" ? "font-bold" : "font-medium", STAT_TONE[row.tone])}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="font-body-sm text-[10px] text-text-muted">{sell.note}</span>
              <NoticeButton
                notice={{ title: "Listing drafted", description: "The sell studio opens once the listings API is wired." }}
                className="h-auto rounded border-0 bg-emerald-500 px-5 py-2 font-headline-sm text-xs font-bold tracking-wider text-surface-container-lowest uppercase shadow-sm transition-all hover:bg-emerald-400"
              >
                List for Sale Now
              </NoticeButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
