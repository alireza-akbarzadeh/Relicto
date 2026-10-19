"use client";

import * as React from "react";

interface CopilotTelemetryProps {
  modelName: string;
  latencyMs?: number;
}

export function CopilotTelemetry({ modelName, latencyMs = 11 }: CopilotTelemetryProps) {
  return (
    <div className="px-5 py-2 bg-[#0a0d14] border-b border-[#1b212f] flex items-center justify-between text-[11px] font-mono shrink-0">
      <div className="flex items-center gap-2.5 text-slate-400">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Steam API: <strong className="text-white font-semibold">{latencyMs}ms</strong>
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-300">2FA Synced</span>
        <span className="text-slate-600">•</span>
        <span className="text-rose-400/90">Anti-Phishing Active</span>
      </div>
      <div className="text-slate-500 text-[10px] hidden sm:block font-mono">
        {modelName}
      </div>
    </div>
  );
}
