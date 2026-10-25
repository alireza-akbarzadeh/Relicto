"use client";

import * as React from "react";
import { Bot, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface CopilotTriggerProps {
  open: boolean;
  onClick: () => void;
}

export function CopilotTrigger({ open, onClick }: CopilotTriggerProps) {
  const t = useTranslations("copilot.trigger");

  return (
    <Button
      type="button"
      variant={null}
      size={null}
      onClick={onClick}
      aria-label={open ? t("closeLabel") : t("openLabel")}
      title={open ? t("closeTitle") : t("openTitle")}
      className="fixed bottom-20 sm:bottom-6 end-4 sm:end-6 z-50 group flex h-auto items-center gap-2.5 p-3 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 text-white shadow-[0_10px_30px_rgba(244,63,94,0.45),0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.65),0_0_30px_rgba(244,63,94,0.5)] border border-rose-400/50 hover:scale-105 active:scale-95 transition-all duration-300"
    >
      {/* Outer ambient glow */}
      <span className="absolute -inset-1 rounded-full bg-rose-500/30 blur-md pointer-events-none group-hover:bg-rose-500/50 transition-colors" />

      {/* Button content */}
      <div className="relative flex items-center gap-2.5">
        <div className="relative flex items-center justify-center size-7">
          {open ? (
            <X className="size-5 text-white transition-transform duration-200 rotate-0 group-hover:rotate-90" />
          ) : (
            <>
              <Bot className="size-5 text-white group-hover:scale-110 transition-transform" />
              {/* Online pulse ping */}
              <span className="absolute -top-1 -right-1 size-2.5 bg-emerald-400 rounded-full border-2 border-rose-700">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </span>
            </>
          )}
        </div>

        {/* Desktop pill text label */}
        <span className="hidden sm:flex items-center gap-1.5 pe-1.5 font-display text-xs font-bold tracking-wide select-none">
          <span>{open ? t("closeBtn") : t("openBtn")}</span>
          {!open && (
            <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/20 text-white font-semibold">
              <Sparkles className="size-2.5 text-amber-300" />
              {t("aiBadge")}
            </span>
          )}
        </span>
      </div>
    </Button>
  );
}
