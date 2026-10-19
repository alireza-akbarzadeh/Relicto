"use client";

import * as React from "react";
import { Settings, Cpu, ShieldCheck, Bell, Volume2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { requestPushPermission, getPushPermissionStatus } from "../utils/copilot-notify";

interface CopilotSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeModel: string;
  onModelChange: (model: string) => void;
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  pushEnabled: boolean;
  onPushChange: (enabled: boolean) => void;
}

export function CopilotSettingsDialog({
  open,
  onOpenChange,
  activeModel,
  onModelChange,
  soundEnabled,
  onSoundChange,
  pushEnabled,
  onPushChange,
}: CopilotSettingsDialogProps) {
  const [selected, setSelected] = React.useState(activeModel);

  const AVAILABLE_MODELS = [
    { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash (Recommended)", desc: "Ultra-fast multimodal reasoning & trade security" },
    { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite", desc: "Highest throughput, ultra-low latency execution" },
  ];

  const handleSave = () => {
    onModelChange(selected);
    onOpenChange(false);
  };

  const handleTogglePush = async () => {
    if (!pushEnabled) {
      const status = await requestPushPermission();
      if (status === "granted") {
        onPushChange(true);
      }
    } else {
      onPushChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0e121b] border border-rose-500/30 text-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-display font-bold text-white flex items-center gap-2">
            <Settings className="size-4 text-rose-400" />
            Sentinel AI Model &amp; Alert Parameters
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Configure Google AI Studio Gemini rails, sound chimes, and push notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-1 text-xs">
          {/* Model selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <Cpu className="size-3.5 text-cyan-400" />
              Active Gemini Model
            </label>
            <div className="space-y-1.5">
              {AVAILABLE_MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selected === m.id
                      ? "bg-rose-500/15 border-rose-500/50 text-white"
                      : "bg-[#141926] border-[#22293b] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-semibold text-[11px]">
                    <span>{m.label}</span>
                    {selected === m.id && (
                      <span className="size-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/80" />
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sound & Push Notification Controls */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <Bell className="size-3.5 text-rose-400" />
              Response Alerts &amp; Notifications
            </label>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => onSoundChange(!soundEnabled)}
                className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                  soundEnabled
                    ? "bg-[#161c29] border-emerald-500/40 text-emerald-300"
                    : "bg-[#10141e] border-[#1d2331] text-slate-400"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Volume2 className="size-3.5" />
                  Sound Chime
                </span>
                {soundEnabled && <Check className="size-3 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={handleTogglePush}
                className={`p-2 rounded-xl border flex items-center justify-between transition-colors ${
                  pushEnabled && getPushPermissionStatus() === "granted"
                    ? "bg-[#161c29] border-cyan-500/40 text-cyan-300"
                    : "bg-[#10141e] border-[#1d2331] text-slate-400"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Bell className="size-3.5" />
                  Push Alerts
                </span>
                {pushEnabled && getPushPermissionStatus() === "granted" && (
                  <Check className="size-3 text-cyan-400" />
                )}
              </button>
            </div>
          </div>

          {/* Key & Project telemetry */}
          <div className="p-2.5 rounded-xl bg-[#090c12] border border-[#1d2331] space-y-1 font-mono text-[10px] text-slate-400">
            <div className="flex items-center justify-between">
              <span>Google Cloud Project:</span>
              <span className="text-slate-200">projects/305955647874</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gemini API Key:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="size-3" /> Configured &amp; Verified
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-mono"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md"
          >
            Apply Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
