import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import type { ShowcaseItem } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { ShowcaseCard } from "./showcase-card";

/** Tier-1 collectibles the trader features on their profile. */
export function ShowcaseSection({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col justify-between gap-space-xs sm:flex-row sm:items-center">
        <SectionTitle
          tone="amber"
          title="Prized Collectibles Showcase"
          subtitle="Selected tier-1 weapons & immortal relics authenticated via Steam Web API."
        />
        <div className="flex items-center gap-space-xs self-start sm:self-auto">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">SORT: HIGHEST VALUATION</span>
          <NoticeButton
            notice={{ title: "Showcase sorting", description: "Custom showcase ordering ships with the profile editor." }}
            aria-label="Change showcase sorting"
            className="inline-block h-auto rounded border-0 bg-surface-container p-1 text-text-muted hover:text-text-primary"
          >
            <Icon name="tune" className="text-[18px]" />
          </NoticeButton>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {items.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
