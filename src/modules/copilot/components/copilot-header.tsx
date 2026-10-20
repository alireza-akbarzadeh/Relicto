"use client";

import * as React from "react";
import { Volume2, VolumeX, RotateCcw, Settings, X, Shield, HelpCircle, MessageSquare, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CopilotMode } from "../types";

interface CopilotHeaderProps {
  currentMode: CopilotMode;
  onModeChange: (mode: CopilotMode) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  pushEnabled?: boolean;
  onTogglePush?: () => void;
  onClearSession: () => void;
  onOpenSettings: () => void;
  onClose?: () => void;
}

export function CopilotHeader({
  currentMode,
  onModeChange,
  audioEnabled,
  onToggleAudio,
  pushEnabled,
  onTogglePush,
  onClearSession,
  onOpenSettings,
  onClose,
}: CopilotHeaderProps) {
  return (
    <header className="px-5 pt-4 pb-3 bg-[#131724]/90 backdrop-blur-md border-b border-[#23293c] flex flex-col shrink-0 z-10 gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Status Avatar */}
          <div className="relative">
            <div className="size-10 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-rose-400/40">
              <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 rounded-full border-2 border-[#131724] flex items-center justify-center">
              <span className="size-1.5 bg-white rounded-full animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                SENTINEL AI <span className="text-rose-400 font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 border border-rose-500/30">&quot;ALI&quot;</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Ali • Escrow Guardian v4.8</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium">Valve Dev Gateway</span>
            </p>
          </div>
        </div>

        {/* Control actions */}
        <div className="flex items-center gap-1 text-slate-400">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onToggleAudio}
            title={audioEnabled ? "Mute audio readout" : "Enable audio readout"}
            className="p-1.5 size-8 hover:bg-white/5 hover:text-white"
          >
            {audioEnabled ? <Volume2 className="size-4 text-rose-400" /> : <VolumeX className="size-4" />}
          </Button>

          {onTogglePush && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onTogglePush}
              title={pushEnabled ? "Push notifications active (Click to mute)" : "Enable desktop push notifications"}
              className="p-1.5 size-8 hover:bg-white/5 hover:text-white"
            >
              {pushEnabled ? <Bell className="size-4 text-cyan-400" /> : <BellOff className="size-4 text-slate-500" />}
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClearSession}
            title="Clear session"
            className="p-1.5 size-8 hover:bg-white/5 hover:text-white"
          >
            <RotateCcw className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onOpenSettings}
            title="Settings & API Model"
            className="p-1.5 size-8 hover:bg-white/5 hover:text-white"
          >
            <Settings className="size-4" />
          </Button>

          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onClose}
              title="Close window"
              className="p-1.5 size-8 hover:bg-rose-500/20 hover:text-rose-300"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Segmented Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-[#0b0e15] p-1 rounded-xl border border-[#1e2433] text-xs font-mono font-medium">
        <button
          type="button"
          onClick={() => onModeChange("copilot")}
          className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "copilot"
              ? "bg-rose-600 text-white font-semibold shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <MessageSquare className="size-3.5" />
          <span>Copilot</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("audit")}
          className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "audit"
              ? "bg-rose-600 text-white font-semibold shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Shield className="size-3.5 text-amber-400" />
          <span>Quick Audit</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("codex")}
          className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "codex"
              ? "bg-rose-600 text-white font-semibold shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <HelpCircle className="size-3.5 text-cyan-400" />
          <span>FAQ & Codex</span>
        </button>
      </div>
    </header>
  );
}
