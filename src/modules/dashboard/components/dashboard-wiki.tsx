"use client";

import * as React from "react";
import { BookOpen, Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardWikiGuide } from "../types";
import { WikiGuideSheet } from "./wiki-guide-sheet";
import { deleteWikiGuideAction } from "../actions/admin-wiki";

export function DashboardWiki({ guides: initialGuides }: { guides: DashboardWikiGuide[] }) {
  const [guides, setGuides] = React.useState(initialGuides);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedGuide, setSelectedGuide] = React.useState<DashboardWikiGuide | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (guideId: string) => {
    if (!confirm("Are you sure you want to delete this wiki guide?")) return;
    setDeletingId(guideId);
    try {
      const res = await deleteWikiGuideAction(guideId);
      if (res.success) {
        toast.success(res.message);
        setGuides((prev) => prev.filter((g) => g.id !== guideId));
      } else {
        toast.error(res.error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            Wiki Knowledge Base & Educational Codex
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Manage authored guides, weapon float math, seed tier lists, and market economy articles
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedGuide(null);
            setSheetOpen(true);
          }}
          className="gap-1.5 font-semibold text-xs shadow-sm self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          Create Guide
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <tr>
                <th className="pb-3 font-semibold">Guide Title & Summary</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Kind</th>
                <th className="pb-3 font-semibold">Read Time</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {guides.map((g) => (
                <tr key={g.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="py-3">
                    <div className="flex flex-col max-w-md">
                      <span className="font-semibold text-text-primary leading-tight">{g.title}</span>
                      <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{g.summary}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container border border-border-subtle">
                      {g.category}
                    </span>
                  </td>
                  <td className="py-3 font-mono uppercase text-[10px] text-text-secondary">{g.kind}</td>
                  <td className="py-3 font-mono text-text-muted">{g.readMinutes ?? 5} min</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setSelectedGuide(g);
                          setSheetOpen(true);
                        }}
                        className="gap-1 font-mono text-xs"
                      >
                        <Edit2 className="size-3" />
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        disabled={deletingId === g.id}
                        onClick={() => handleDelete(g.id)}
                        className="text-rose-400 hover:text-rose-300 font-mono text-xs"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <WikiGuideSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        guide={selectedGuide}
        onSuccess={() => window.location.reload()}
      />
    </Card>
  );
}
