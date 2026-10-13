"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { WikiData } from "../types";
import { WIKI_TONE } from "./guide-card";

export function RevisionLedger({ revisions }: { revisions: WikiData["revisions"] }) {
  return (
    <section className="px-margin-desktop py-space-lg">
      <div className="mx-auto max-w-7xl">
        <div className="mb-space-md flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-space-sm font-headline-lg text-headline-lg text-text-primary">
              <Icon name="history" className="text-[24px] text-secondary" />
              Community Revisions &amp; Cryptographic Ledger
            </h2>
            <p className="text-text-secondary">
              Every formula edit and pattern mapping must pass peer audit before canonical commit.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              toast.info("Community wiki contribution", {
                description: "Pull request template available in the Relicto codex repo.",
              });
            }}
            className="inline-flex h-auto cursor-pointer items-center justify-center rounded bg-surface-container-high px-3 py-2 font-label-caps text-[10px] text-text-primary uppercase transition-colors hover:bg-surface-container-highest"
          >
            Submit Wiki Edit
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl bg-surface-card">
          <table className="w-full min-w-225 text-left">
            <thead className="bg-surface-container-lowest font-label-caps text-[10px] text-text-muted uppercase">
              <tr>
                {[
                  "Article Entity & Node",
                  "Author & Trust Rating",
                  "Commit Hash",
                  "Changes Logged",
                  "Timestamp",
                  "Audit",
                ].map((label) => (
                  <th key={label} className="px-3 py-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revisions.map((revision) => (
                <tr
                  key={revision.id}
                  className="border-t border-white/6 text-xs hover:bg-surface-container-high/30"
                >
                  <td className="px-3 py-3">
                    <span className="font-semibold text-text-primary">{revision.title}</span>
                    <span className="block font-label-badge text-[10px] text-text-muted">
                      {revision.path}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-text-primary">{revision.author}</span>
                    <span className={cn("block font-label-badge text-[10px]", WIKI_TONE[revision.tone])}>
                      {revision.trust}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-data-mono-md text-status-upcoming">
                    {revision.commit}
                  </td>
                  <td className="max-w-sm px-3 py-3 text-text-secondary">{revision.changes}</td>
                  <td className="px-3 py-3 font-data-mono-md text-text-muted">{revision.time}</td>
                  <td className="px-3 py-3 text-right">
                    <Button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(revision.commit);
                        toast.success("Commit hash copied", { description: revision.commit });
                      }}
                      className="inline-flex h-auto cursor-pointer items-center justify-center rounded bg-surface-container-high px-2 py-1 font-label-caps text-[10px] text-text-secondary uppercase transition-colors hover:bg-surface-container-highest hover:text-text-primary"
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
