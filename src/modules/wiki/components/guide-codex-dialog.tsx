"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { GUIDE_CODEX_DATA, type GuideCodexEntry } from "../data/guide-codex-data";
import { WIKI_TONE } from "./guide-card";
import type { WikiGuide } from "../types";

export function GuideCodexDialog({
  guide,
  open,
  onOpenChange,
}: {
  guide: WikiGuide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!guide) return null;
  const codex: GuideCodexEntry | undefined = GUIDE_CODEX_DATA[guide.id];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-4xl sm:max-w-4xl max-h-[88vh] overflow-y-auto bg-surface-card p-6 md:p-8 text-on-surface border border-border-subtle shadow-2xl rounded-2xl">
        <DialogHeader className="pr-10 border-b border-white/8 pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={cn("rounded bg-surface-container-high px-2 py-0.5 font-label-badge text-xs uppercase font-bold", WIKI_TONE[guide.categoryTone])}>
              {guide.category}
            </span>
            <span className="font-data-mono-md text-xs text-text-muted">DOC #{guide.id.toUpperCase()}</span>
            <span className="text-xs text-text-muted">· {guide.meta}</span>
          </div>
          <DialogTitle className="font-headline-lg text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            {codex?.title ?? guide.title}
          </DialogTitle>
          <DialogDescription className="font-body-md text-sm text-text-secondary mt-1">
            {codex?.subtitle ?? guide.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Executive Summary */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-5">
            <span className="font-label-caps text-xs text-primary uppercase font-bold flex items-center gap-1.5 mb-1.5">
              <Icon name="verified" className="text-sm" />
              Executive Field Summary & Verified Finding
            </span>
            <p className="font-body-md text-sm leading-relaxed text-text-primary">
              {codex?.executiveSummary ?? guide.summary}
            </p>
          </div>

          {/* Structured Sections */}
          {codex?.sections.map((sec, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <h4 className="font-headline-sm text-base md:text-lg font-bold text-text-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {sec.heading}
              </h4>
              <p className="font-body-sm text-sm text-text-secondary leading-relaxed">
                {sec.body}
              </p>

              {sec.formula && (
                <div className="rounded-lg bg-surface-container-lowest p-3 font-data-mono-md text-xs md:text-sm text-tertiary border border-border-dark overflow-x-auto">
                  <code>{sec.formula}</code>
                </div>
              )}

              {sec.bulletPoints && (
                <ul className="flex flex-col gap-1.5 pl-4 list-disc text-sm text-text-secondary">
                  {sec.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx}>{bp}</li>
                  ))}
                </ul>
              )}

              {sec.table && (
                <div className="overflow-x-auto rounded-lg border border-border-dark bg-surface-container-lowest">
                  <table className="w-full text-left font-data-mono-md text-xs">
                    <thead>
                      <tr className="border-b border-border-dark bg-surface-container-high/40">
                        {sec.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-2.5 font-bold text-text-muted uppercase text-[11px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/4">
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface-container-high/20 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={cn("p-2.5", cIdx === 0 ? "font-bold text-text-primary" : cIdx === 3 ? "text-tertiary font-bold" : "text-text-secondary")}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* Trader Risk & Rules of Thumb */}
          {codex?.traderAdvice && codex.traderAdvice.length > 0 && (
            <div className="rounded-xl border border-border-dark bg-surface-container-lowest p-4">
              <span className="font-label-caps text-xs text-status-upcoming uppercase font-bold flex items-center gap-1.5 mb-2">
                <Icon name="gavel" className="text-sm" />
                Relicto Trader Protocol & Overpay Rules of Thumb
              </span>
              <ul className="flex flex-col gap-2 text-xs md:text-sm text-text-secondary">
                {codex.traderAdvice.map((adv, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2">
                    <span className="text-status-upcoming mt-0.5 font-bold">›</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author footer */}
          <div className="flex items-center justify-between border-t border-white/6 pt-4 text-xs text-text-muted">
            <span>Author: <strong className="text-text-primary">{codex?.author ?? "@Relicto_Research"}</strong> ({codex?.authorRole ?? "Verified Archivist"})</span>
            <span>Status: <span className="text-status-live font-bold">Verified in Engine</span></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
