"use client";

import * as React from "react";
import { Link as LinkIcon, Code2, Mic, Send } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { SLASH_COMMANDS } from "../data/copilot-knowledge";

interface CopilotOmnibarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export function CopilotOmnibar({ onSendMessage, disabled }: CopilotOmnibarProps) {
  const t = useTranslations("copilot.omnibar");
  const [input, setInput] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || cooldown > 0) return;
    onSendMessage(input.trim());
    setInput("");
    setCooldown(3);
  };

  const handleCommandClick = (cmd: string) => {
    if (cmd === "/escrow") {
      onSendMessage(t("slashEscrow"));
    } else if (cmd === "/cache-guide") {
      onSendMessage(t("slashCache"));
    } else if (cmd === "/float-check") {
      onSendMessage(t("slashFloat"));
    } else if (cmd === "/api-key-audit") {
      onSendMessage(t("slashApiKey"));
    } else if (cmd === "/payout-calc") {
      onSendMessage(t("slashPayout"));
    } else {
      setInput(`${cmd} `);
    }
  };

  const handlePasteTradeUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes("steamcommunity.com") || text.includes("tradeoffer")) {
        setInput(text);
        toast.success(t("toastTradePasted"));
      } else {
        setInput("https://steamcommunity.com/tradeoffer/new/?partner=94821&token=SEC-XXXX");
        toast.info(t("toastSampleTrade"));
      }
    } catch {
      setInput("https://steamcommunity.com/tradeoffer/new/?partner=94821&token=SEC-XXXX");
    }
  };

  return (
    <div className="p-4 bg-[#131724] border-t border-[#23293c] shrink-0 z-10 space-y-2.5">
      {/* Quick Slash Commands Rail */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10.5px] font-mono text-slate-400 pb-0.5">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold shrink-0">
          {t("commandsLabel")}
        </span>
        {SLASH_COMMANDS.map((c) => (
          <button
            key={c.cmd}
            type="button"
            onClick={() => handleCommandClick(c.cmd)}
            className="px-2.5 py-1 rounded-md bg-[#1a2131] hover:bg-rose-500/20 text-slate-300 hover:text-white border border-[#27324b] transition-colors whitespace-nowrap"
          >
            {c.cmd}
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0c0f16] rounded-xl border border-[#262f44] focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all p-2.5 flex flex-col gap-2"
      >
        <div className="flex items-center px-1">
          <input
            type="text"
            value={input}
            disabled={disabled}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none font-sans"
          />
        </div>

        {/* Utility Tray */}
        <div className="flex items-center justify-between px-1 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              onClick={handlePasteTradeUrl}
              title={t("tradeUrlTooltip")}
              className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors text-slate-400"
            >
              <LinkIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('{"trade_offer_id": "94821", "method": "IEconService/GetTradeOffer"}');
                toast.info(t("toastJsonLoaded"));
              }}
              title={t("jsonDebugTooltip")}
              className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors text-slate-400"
            >
              <Code2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => toast.info(t("toastVoiceActive"))}
              title={t("voiceTooltip")}
              className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors text-slate-400"
            >
              <Mic className="size-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline ms-1.5 bg-[#161c28] px-2 py-0.5 rounded border border-slate-800">
              {t("shortcutHint")}
            </span>
          </div>

          <button
            type="submit"
            disabled={disabled || !input.trim() || cooldown > 0}
            title={cooldown > 0 ? t("rateLimit", { seconds: cooldown }) : t("send")}
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white min-w-[34px] h-[34px] rounded-lg transition-all shadow-md shadow-rose-950/40 active:scale-95 flex items-center justify-center cursor-pointer font-mono text-[11px] font-bold"
          >
            {cooldown > 0 ? `${cooldown}s` : <Send className="size-3.5 rtl:rotate-180" />}
          </button>
        </div>
      </form>

      {/* Footer Disclaimer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1 pt-0.5">
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          {t("shield")}
        </span>
        <span>{t("certified")}</span>
      </div>
    </div>
  );
}
