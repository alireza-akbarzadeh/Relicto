"use client";

import * as React from "react";
import { BookOpen, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createWikiGuideAction, updateWikiGuideAction } from "../actions/admin-wiki";
import type { DashboardWikiGuide } from "../types";

interface WikiGuideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guide?: DashboardWikiGuide | null;
  onSuccess: () => void;
}

export function WikiGuideSheet({ open, onOpenChange, guide, onSuccess }: WikiGuideSheetProps) {
  const isEditing = Boolean(guide);
  const [saving, setSaving] = React.useState(false);

  const [title, setTitle] = React.useState(guide?.title ?? "");
  const [slug, setSlug] = React.useState(guide?.slug ?? "");
  const [category, setCategory] = React.useState(guide?.category ?? "Market Mechanics");
  const [summary, setSummary] = React.useState(guide?.summary ?? "");
  const [readMinutes, setReadMinutes] = React.useState(guide?.readMinutes ?? 5);

  const [prevGuide, setPrevGuide] = React.useState(guide);
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (guide !== prevGuide || open !== prevOpen) {
    setPrevGuide(guide);
    setPrevOpen(open);
    if (guide) {
      setTitle(guide.title);
      setSlug(guide.slug);
      setCategory(guide.category);
      setSummary(guide.summary);
      setReadMinutes(guide.readMinutes ?? 5);
    } else {
      setTitle("");
      setSlug("");
      setCategory("Market Mechanics");
      setSummary("");
      setReadMinutes(5);
    }
  }

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      toast.error("Title and summary are required.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && guide) {
        const res = await updateWikiGuideAction(guide.id, {
          title,
          category,
          summary,
          readMinutes,
        });
        if (res.success) {
          toast.success("Wiki guide updated.");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(res.error ?? "Failed to update guide.");
        }
      } else {
        const res = await createWikiGuideAction({
          title,
          slug,
          category,
          summary,
          readMinutes,
        });
        if (res.success) {
          toast.success("New wiki guide published.");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(res.error ?? "Failed to publish guide.");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-card border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            {isEditing ? "Edit Wiki Article" : "Create Codex Guide"}
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Publish educational guides on wear mechanics, pattern seeds, or trading math.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Guide Title</label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. CS2 Case Odds & Float Formulas"
              className="h-8 text-xs bg-surface-container border-border-subtle"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Slug</label>
              <Input
                value={slug}
                disabled={isEditing}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cs2-case-odds"
                className="h-8 text-xs font-mono bg-surface-container border-border-subtle disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Market Mechanics"
                className="h-8 text-xs bg-surface-container border-border-subtle"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Read Time (Minutes)</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={readMinutes}
              onChange={(e) => setReadMinutes(Number(e.target.value))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Summary Abstract</label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="Concise overview of what traders learn in this article..."
              className="w-full text-xs bg-surface-container border-border-subtle"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="gap-1.5 text-xs font-semibold">
              <Save className="size-3.5" />
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Guide"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
