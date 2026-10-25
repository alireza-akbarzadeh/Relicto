"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface CopilotQuickCodexProps {
  onSelectPrompt: (query: string) => void;
}

export function CopilotQuickCodex({ onSelectPrompt }: CopilotQuickCodexProps) {
  const t = useTranslations("copilot.quickCodex");

  const prompts = [
    {
      id: "cache",
      icon: "🎁",
      title: t("prompts.cacheTitle"),
      query: t("prompts.cacheQuery"),
    },
    {
      id: "hijack",
      icon: "🛡️",
      title: t("prompts.hijackTitle"),
      query: t("prompts.hijackQuery"),
    },
    {
      id: "hold",
      icon: "⏱️",
      title: t("prompts.holdTitle"),
      query: t("prompts.holdQuery"),
    },
    {
      id: "doppler",
      icon: "💎",
      title: t("prompts.dopplerTitle"),
      query: t("prompts.dopplerQuery"),
    },
    {
      id: "crypto",
      icon: "⚡",
      title: t("prompts.cryptoTitle"),
      query: t("prompts.cryptoQuery"),
    },
  ];

  return (
    <div className="bg-[#111623]/80 border-b border-[#212739] shrink-0 px-5 py-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">💡</span>
          <h2 className="text-xs font-display font-semibold text-slate-200 tracking-wide uppercase">
            {t("title")}
          </h2>
        </div>
        <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1 select-none">
          {t("tapToAsk")}
          <ChevronRight className="size-3 rtl:rotate-180" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        {prompts.map((prompt) => (
          <Button
            key={prompt.id}
            type="button"
            variant={null}
            size={null}
            onClick={() => onSelectPrompt(prompt.query)}
            className="h-auto px-2.5 py-1.5 rounded-lg bg-[#161c28] hover:bg-rose-500/15 text-slate-300 hover:text-rose-200 border border-[#23293c] hover:border-rose-500/40 transition-colors flex items-center gap-2 text-start"
          >
            <span className="text-xs shrink-0">{prompt.icon}</span>
            <span className="truncate">{prompt.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
