"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { SellGame } from "../types";

const GAME_LABELS: Record<SellGame, string> = {
  cs2: "CS2",
  dota2: "Dota 2",
  tf2: "TF2",
};

export type SellerToolbarProps = {
  game: SellGame;
  setGame: (game: SellGame) => void;
  filter: "tradable" | "hold";
  setFilter: (filter: "tradable" | "hold") => void;
  query: string;
  setQuery: (query: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  selected: string[];
  onSelectAll: () => void;
  onBulkList: (discount?: number) => void;
  pending: boolean;
  tradableCount: number;
  holdCount: number;
  gameCounts: Record<SellGame, number>;
};

export function SellerToolbar({
  game,
  setGame,
  filter,
  setFilter,
  query,
  setQuery,
  sort,
  setSort,
  selected,
  onSelectAll,
  onBulkList,
  pending,
  tradableCount,
  holdCount,
  gameCounts,
}: SellerToolbarProps) {
  const t = useTranslations("sellerToolbar");

  const sortOptions: readonly SelectOption<string>[] = [
    { value: "highest", label: t("sortHighest") },
    { value: "lowest", label: t("sortLowest") },
  ];

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-1 rounded border border-white/6 bg-surface-container-lowest p-1">
          {(["cs2", "dota2", "tf2"] as SellGame[]).map((value) => (
            <Button
              key={value}
              variant={null}
              size={null}
              onClick={() => setGame(value)}
              className={cn(
                "h-auto rounded px-3 py-1 font-headline-sm text-xs uppercase",
                game === value
                  ? "border border-white/10 bg-surface-card font-semibold text-text-primary"
                  : "text-text-muted hover:text-text-primary",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  value === "cs2"
                    ? "bg-primary"
                    : value === "dota2"
                      ? "bg-status-upcoming"
                      : "bg-tertiary",
                )}
              />
              {GAME_LABELS[value]} {t("itemsCount", { count: gameCounts[value] ?? 0 })}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={null}
            size={null}
            onClick={() => setFilter("tradable")}
            className={cn(
              "h-auto rounded border px-2.5 py-1 font-data-mono-md text-xs",
              filter === "tradable"
                ? "border-primary/30 bg-primary/15 text-primary"
                : "border-white/6 bg-surface-container-highest/60 text-text-muted",
            )}
          >
            {t("tradableNow", { count: tradableCount })}
          </Button>
          <Button
            variant={null}
            size={null}
            onClick={() => setFilter("hold")}
            className={cn(
              "h-auto rounded border px-2.5 py-1 font-data-mono-md text-xs",
              filter === "hold"
                ? "border-tertiary/30 bg-tertiary/15 text-tertiary"
                : "border-white/6 bg-surface-container-highest/60 text-text-muted",
            )}
          >
            {t("tradeHold", { count: holdCount })}
          </Button>
          <Button
            variant={null}
            size={null}
            disabled
            className="h-auto rounded border border-white/4 px-2.5 py-1 font-data-mono-md text-xs text-text-muted"
          >
            {t("nonTradable", { count: 0 })}
          </Button>
          <a
            href="#trade-up"
            className="flex h-auto items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2.5 py-1 font-headline-sm text-xs font-semibold text-primary uppercase transition-colors hover:bg-primary/20"
          >
            <Icon name="whatshot" className="text-[14px]" />
            {t("tradeUpForge")}
          </a>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-2.5 rounded-lg border border-white/8 bg-surface-card p-2 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center rounded bg-surface-container-lowest px-3 py-1.5">
          <Icon name="search" className="mr-2 text-[17px] text-text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
            className="h-auto border-0 bg-transparent p-0 text-xs text-text-primary focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={null}
            size={null}
            disabled={pending || selected.length === 0}
            onClick={() => onBulkList(-1)}
            className="h-auto gap-1 rounded border border-white/6 bg-surface-container px-3 py-1.5 font-label-caps text-xs text-tertiary uppercase hover:bg-surface-bright disabled:opacity-50"
          >
            <Icon name="flash_on" className="text-[15px]" />
            {t("autoPriceFloor")}
          </Button>
          <Button
            variant={null}
            size={null}
            onClick={onSelectAll}
            className="h-auto rounded border border-white/6 bg-surface-container px-3 py-1.5 font-label-caps text-xs text-text-secondary uppercase hover:bg-surface-bright"
          >
            {t("selectAll", { count: selected.length })}
          </Button>
          <Select
            label="Sort inventory"
            value={sort}
            onValueChange={setSort}
            options={sortOptions}
            triggerClassName="rounded border border-white/6 bg-surface-container px-3 py-1.5 font-label-caps text-xs text-text-secondary uppercase"
            iconClassName="absolute top-2 right-2 text-[14px] text-text-muted"
          />
          <Button
            variant={null}
            size={null}
            disabled={pending || selected.length === 0}
            onClick={() => onBulkList(0)}
            className="h-auto gap-1.5 rounded bg-primary px-3.5 py-1.5 font-headline-sm text-xs font-bold tracking-wide text-white uppercase shadow-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Icon name="receipt_long" className="text-[15px]" />
            {t("bulkList", { count: selected.length })}
          </Button>
        </div>
      </div>
    </div>
  );
}
