"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { QUICK_PROMPTS } from "../data/copilot-knowledge";

interface CopilotQuickCodexProps {
  onSelectPrompt: (query: string) => void;
}

export function CopilotQuickCodex({ onSelectPrompt }: CopilotQuickCodexProps) {
  return (
    <div className="bg-[#111623]/80 border-b border-[#212739] shrink-0 px-5 py-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-xs">💡</span>
          <h2 className="text-xs font-display font-semibold text-slate-200 tracking-wide uppercase">
            Quick Codex &amp; FAQs
          </h2>
        </div>
        <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1 select-none">
          Tap prompt to ask
          <ChevronRight className="size-3" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.title}
            type="button"
            onClick={() => onSelectPrompt(prompt.query)}
            className="px-2.5 py-1.5 rounded-lg bg-[#161c28] hover:bg-rose-500/15 text-slate-300 hover:text-rose-200 border border-[#23293c] hover:border-rose-500/40 transition-colors flex items-center gap-2 text-left"
          >
            <span className="text-xs shrink-0">{prompt.icon}</span>
            <span className="truncate">{prompt.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
