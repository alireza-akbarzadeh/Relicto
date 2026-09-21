import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import type { BattleCard, HubMobileData } from "../../mobile.types";

const ACTION = "h-8 w-full gap-1 rounded border-0 bg-surface-container-high font-headline-sm text-label-caps font-bold text-text-primary transition-colors hover:bg-surface-container-highest";

function Card({ card }: { card: BattleCard }) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-2.5 rounded-xl bg-surface-card p-3 shadow-md">
      <div className="flex items-center justify-between">
        <span className={cn("rounded bg-surface-dim px-2 py-0.5 font-label-badge text-label-badge", card.badgeTone === "cyan" ? "text-status-upcoming" : "text-tertiary")}>
          {card.badge}
        </span>
        <span className={cn("font-label-badge text-label-badge", card.live ? "font-semibold text-emerald-400" : "text-text-muted")}>{card.status}</span>
      </div>
      {card.teams.map((team, index) => (
        <div key={team.name} className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-headline-sm text-text-primary">{team.name}</span>
            <span className="rounded bg-surface-container px-1.5 font-data-mono-md text-label-badge text-text-secondary">{team.odds}</span>
          </div>
          <span
            className={cn(
              "font-data-mono-md text-data-mono-md",
              card.live ? cn("font-bold", index === 0 ? "text-primary" : "text-secondary") : "text-text-muted",
            )}
          >
            {team.score}
          </span>
        </div>
      ))}
      {card.action.kind === "vote" ? (
        <NoticeButton notice={{ title: "Vote cast", description: `150 pts staked on ${card.teams[0].name} vs ${card.teams[1].name}.` }} className={ACTION}>
          <span>{card.action.label}</span>
          <Icon name="chevron_right" className="text-[16px]" />
        </NoticeButton>
      ) : (
        <LinkButton href="/alerts" className={ACTION}>
          <span>{card.action.label}</span>
          <Icon name="notifications_active" className="text-[16px]" />
        </LinkButton>
      )}
    </div>
  );
}

/** Swipeable ongoing and upcoming matches. */
export function BattleCarousel({ battles }: { battles: HubMobileData["battles"] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-margin">
        <h2 className="flex items-center gap-1.5 font-headline-sm text-headline-sm text-text-primary">
          <Icon name="radar" className="text-[20px] text-primary" />
          <span>Ongoing &amp; Next Battles</span>
        </h2>
        <span className="font-label-badge text-label-badge text-text-secondary">{battles.live}</span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-margin py-1">
        {battles.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
