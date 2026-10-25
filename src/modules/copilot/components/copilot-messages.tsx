"use client";

import * as React from "react";
import { Check, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { CopilotMessage, TradeDiagnostic } from "../types";

interface CopilotMessagesProps {
  messages: CopilotMessage[];
  loading: boolean;
}

export function CopilotMessages({ messages, loading }: CopilotMessagesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const t = useTranslations("copilot.messages");
  const tDiag = useTranslations("copilot.diagnostic");

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(tDiag("toastCopied", { label }));
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-xs font-sans no-scrollbar"
    >
      {/* Session time marker */}
      <div className="flex justify-center my-1">
        <span className="text-[10px] font-mono text-slate-500 bg-[#141926] px-3.5 py-1 rounded-full border border-slate-800/80">
          {t("sessionEncrypted")}
        </span>
      </div>

      {messages.map((m) => {
        const isBot = m.role === "assistant";

        if (!isBot) {
          return (
            <div key={m.id} className="flex gap-3 items-start justify-end">
              <div className="space-y-1.5 max-w-[85%] text-end">
                <div className="bg-rose-600 text-white rounded-2xl rounded-tr-sm p-3.5 leading-relaxed shadow-md shadow-rose-950/30 text-start">
                  <p className="font-medium">{m.content}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 pe-1">
                  {m.timestamp} {m.tag ? `• ${m.tag}` : ""}
                </span>
              </div>
              <div className="size-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-slate-300">
                {t("userAvatar")}
              </div>
            </div>
          );
        }

        return (
          <div key={m.id} className="flex gap-3 items-start">
            <div className="size-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-rose-400 text-xs font-bold font-mono">{t("aiAvatar")}</span>
            </div>
            <div className="space-y-2.5 max-w-[90%]">
              <div className="bg-[#161c2b] border border-[#252c3e] rounded-2xl rounded-tl-sm p-4 text-slate-200 space-y-3.5 shadow-md">
                {m.diagnostic && <DiagnosticCard diag={m.diagnostic} onCopy={handleCopy} />}

                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 ps-1">
                {m.timestamp} • {t("botTag")}
              </span>
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex gap-3 items-start">
          <div className="size-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-rose-400 text-xs font-bold font-mono">{t("aiAvatar")}</span>
          </div>
          <div className="bg-[#161c2b] border border-[#252c3e] rounded-2xl rounded-tl-sm p-3.5 text-slate-400 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-rose-500 animate-bounce" />
            <span className="size-1.5 rounded-full bg-rose-500 animate-bounce delay-100" />
            <span className="size-1.5 rounded-full bg-rose-500 animate-bounce delay-200" />
            <span className="text-[11px] font-mono ms-1">{t("analyzing")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DiagnosticCard({
  diag,
  onCopy,
}: {
  diag: TradeDiagnostic;
  onCopy: (text: string, label: string) => void;
}) {
  const t = useTranslations("copilot.diagnostic");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="font-display font-bold text-white text-xs tracking-wide">
            {t("title")}
          </span>
        </div>
        <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded font-semibold">
          {t("verified")}
        </span>
      </div>

      <div className="bg-[#0d1017] rounded-xl p-3 border border-[#1f2637] font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>{t("inspectedAsset")}</span>
          <span className="text-white font-semibold">{diag.assetName}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>{t("counterparty")}</span>
          <span className="text-cyan-400 flex items-center gap-1.5">
            <strong>{diag.counterparty}</strong>
            {diag.counterpartyLevel && (
              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {t("lvl", { level: diag.counterpartyLevel })}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>{t("steamId")}</span>
          <span className="text-slate-200 text-[10px] select-all font-mono">{diag.steamId64}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>{t("escrowStatus")}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Check className="size-3.5" />
            {diag.escrowStatus}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-0.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          {t("safetyVerif")}
        </span>
        <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
          {diag.checks.map((check, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0e121a] border border-[#1d2331]">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>{check}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1 font-mono text-xs">
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => toast.success(t("toastSafe", { tradeId: diag.tradeId }))}
          className="h-auto py-2 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/40 active:scale-[0.98] transition-all"
        >
          <Check className="size-3.5" />
          <span>{t("confirmOffer")}</span>
        </Button>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={() => onCopy(diag.steamId64, "SteamID64")}
          className="h-auto py-2 px-3 bg-[#1e2536] hover:bg-[#252f44] text-slate-200 font-medium rounded-lg border border-[#2b354d] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Copy className="size-3.5 text-slate-400" />
          <span>{t("copySteamId")}</span>
        </Button>
      </div>
    </div>
  );
}
