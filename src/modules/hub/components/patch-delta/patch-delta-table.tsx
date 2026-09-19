import { Activity, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDelta, formatMoney } from "@/lib/format";
import { STATUS_PILL, TONE_DOT, TONE_TEXT } from "../../lib/tones";
import type { DeltaRow } from "../../types";
import { SectionHeading } from "../shared/section-heading";

const COLUMNS = ["Patch & Adjustment Note", "Target Cosmetic Asset", "Pre-Patch Floor", "Current Floor", "Delta Surge", "24H Volume", "Intel Status"];

function DeltaRowView({ row }: { row: DeltaRow }) {
  return (
    <tr className="transition-colors hover:bg-surface-container">
      <td className="p-3.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">{row.patch}</span>
          <span className="text-[11px] text-text-muted">{row.change}</span>
        </div>
      </td>
      <td className="p-3.5">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", TONE_DOT[row.tone])} />
          <span className="font-semibold text-white">{row.asset}</span>
        </div>
      </td>
      <td className="p-3.5 font-mono text-text-secondary">{formatMoney(row.preFloorUsd)}</td>
      <td className="p-3.5 font-mono font-bold text-white">{formatMoney(row.floorUsd)}</td>
      <td className="p-3.5">
        <span className={cn("flex items-center gap-1 font-mono font-bold", TONE_TEXT[row.tone])}>
          <ArrowUp className="size-3.5" /> {formatDelta(row.deltaPct)}
        </span>
      </td>
      <td className="p-3.5 font-mono text-text-secondary">{row.volume24h} units</td>
      <td className="p-3.5 text-right">
        <span className={cn("rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase", STATUS_PILL[row.tone])}>{row.status}</span>
      </td>
    </tr>
  );
}

/** "Patch Impact Financial Delta": how balance changes moved cosmetic floors. */
export function PatchDeltaTable({ rows, markets }: { rows: DeltaRow[]; markets: number }) {
  return (
    <section id="patch-delta" className="flex scroll-mt-24 flex-col gap-4 rounded-xl border border-border-dark bg-surface-card p-6 shadow-xl">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <SectionHeading icon={Activity} tone="crimson" eyebrow="REAL-TIME VALVE CORRELATION ENGINE" title="Patch Impact Financial Delta" />
        <span className="self-start rounded-md border border-border-dark bg-surface px-3 py-1.5 font-mono text-[10px] text-text-muted uppercase md:self-auto">
          AUTO-SCRAPING {markets} PRO MARKETS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-dark bg-surface font-mono text-[10px] text-text-muted uppercase">
              {COLUMNS.map((column, index) => (
                <th key={column} className={cn("p-3.5", index === COLUMNS.length - 1 && "text-right")}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark/50 text-xs leading-4">
            {rows.map((row) => (
              <DeltaRowView key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
