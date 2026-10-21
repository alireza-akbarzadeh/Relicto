"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { signedMoney, signedPct } from "../../lib/terminal-format";
import type { MarketQuote, VenueQuote } from "../../market.types";

/** A venue price, marked when it's test-mode drift rather than an observation. */
function Venue({ quote, usd, className }: { quote: VenueQuote; usd: number | null; className?: string }) {
  if (usd === null) return <span className="text-text-muted">—</span>;
  return (
    <span className={cn("inline-flex items-center gap-1.5 tabular-nums", className)}>
      {formatMoney(usd)}
      {quote.source === "sim" && <span className="rounded bg-surface-container-high px-1 font-label-badge text-[9px] text-text-muted">SIM</span>}
    </span>
  );
}

/**
 * Where buying Relicto's floor and selling elsewhere pays, widest spread
 * first. Relicto's column is the live book; the venues are their last
 * observation (or test-mode drift). Rows reorder as the market moves.
 */
export function MarketSpreads({ rows, simulated }: { rows: MarketQuote[]; simulated: boolean }) {
  const t = useTranslations("tracker");

  const columns = [
    t("colTracked"),
    t("colRelictoFloor"),
    t("colSteamNet"),
    t("colSecondary"),
    t("colNetSpread"),
    t("colYield"),
    t("colAction"),
  ];

  return (
    <section className="flex flex-col gap-space-md rounded-xl border border-white/8 bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between gap-space-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-text-primary">{t("crossArbitrageTitle")}</h2>
          <p className="font-body-sm text-body-sm text-text-secondary">
            {t("crossArbitrageDesc")}
            {simulated && ` ${t("simDriftTitle")}`}
          </p>
        </div>
        <span className="shrink-0 font-label-badge text-[10px] text-text-muted uppercase">
          {t("updates")} <b className="text-tertiary">{simulated ? t("updateLive") : t("updateChange")}</b>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="font-label-caps text-[10px] text-text-muted uppercase">
            <tr>
              {columns.map((label) => (
                <th key={label} className="px-2 py-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-2 py-6 text-center font-body-sm text-body-sm text-text-muted">
                  {t("noPricedItems")}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.slug} className="border-t border-white/6 text-xs hover:bg-surface-container-high/30">
                <td className="px-2 py-3">
                  <span className="font-headline-sm text-[13px] font-bold text-text-primary">{row.name}</span>
                  <span className="block font-data-mono-md text-[10px] text-text-muted">
                    {row.detail} · {row.listings} {t("listed")} · {row.bids} {t("bids")}
                  </span>
                </td>
                <td className="px-2 py-3 font-data-mono-md text-tertiary tabular-nums">{formatMoney(row.floorUsd)}</td>
                <td className="px-2 py-3 font-data-mono-md text-text-secondary">
                  <Venue quote={row.steam} usd={row.steamNetUsd} />
                </td>
                <td className="px-2 py-3 font-data-mono-md text-tertiary">
                  <Venue quote={row.secondary} usd={row.secondary.usd} />
                </td>
                <td className={cn("px-2 py-3 font-data-mono-md font-bold tabular-nums", (row.spreadUsd ?? 0) >= 0 ? "text-status-upcoming" : "text-primary")}>
                  {row.spreadUsd === null || row.spreadPct === null ? "—" : `${signedMoney(row.spreadUsd)} (${signedPct(row.spreadPct)})`}
                </td>
                <td className={cn("px-2 py-3 font-data-mono-md tabular-nums", (row.steamYieldUsd ?? 0) >= 0 ? "text-status-upcoming" : "text-primary")}>
                  {row.steamYieldUsd === null ? "—" : `${signedMoney(row.steamYieldUsd)} USD`}
                </td>
                <td className="px-2 py-3 text-right">
                  <LinkButton
                    href={`/items/${row.slug}`}
                    className="h-auto gap-1 rounded bg-primary-container px-2 py-1 font-label-caps text-[10px] font-bold text-on-primary-container uppercase"
                  >
                    <Icon name="bolt" className="text-[13px]" />
                    {t("buyFloor")}
                  </LinkButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
