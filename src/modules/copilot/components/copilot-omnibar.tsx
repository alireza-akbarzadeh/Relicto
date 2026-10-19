"use client";

import * as React from "react";
import { Link as LinkIcon, Code2, Mic, Send } from "lucide-react";
import { toast } from "sonner";
import { SLASH_COMMANDS } from "../data/copilot-knowledge";

interface CopilotOmnibarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export function CopilotOmnibar({ onSendMessage, disabled }: CopilotOmnibarProps) {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleCommandClick = (cmd: string) => {
    if (cmd === "/escrow") {
      onSendMessage("Audit active trade escrow and verify Sentinel tradebot status.");
    } else if (cmd === "/float-check") {
      onSendMessage("What are the CS2 wear float ranges and how does float wear transfer work in trade-ups?");
    } else if (cmd === "/api-key-audit") {
      onSendMessage("How do I perform a Steam Web API key audit to verify if my account has been compromised?");
    } else if (cmd === "/payout-calc") {
      onSendMessage("What are the platform fees on Relicto and how is net payout calculated on instant crypto cashouts?");
    } else {
      setInput(`${cmd} `);
    }
  };

  const handlePasteTradeUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes("steamcommunity.com") || text.includes("tradeoffer")) {
        setInput(text);
        toast.success("Pasted Steam trade URL into inspector");
      } else {
        setInput("https://steamcommunity.com/tradeoffer/new/?partner=94821&token=SEC-XXXX");
        toast.info("Inserted sample Steam trade offer link for inspection");
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
          Commands:
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
            placeholder="Ask anything (e.g. 'Can I sell item I bought?', paste trade URL, or /cmd)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none font-sans"
          />
        </div>

        {/* Utility Tray */}
        <div className="flex items-center justify-between px-1 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              onClick={handlePasteTradeUrl}
              title="Paste Trade URL / Steam Offer link"
              className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors text-slate-400"
            >
              <LinkIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('{"trade_offer_id": "94821", "method": "IEconService/GetTradeOffer"}');
                toast.info("Loaded sample Steam API telemetry JSON");
              }}
              title="Paste Steam API debug JSON"
              className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors text-slate-400"
            >
              <Code2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => toast.info("Voice inquiry mode activated")}
              title="Voice Query"
              className="p-1.5 hover:text-white hover:bg-white/5 rounded-md transition-colors text-slate-400"
            >
              <Mic className="size-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline ml-1.5 bg-[#161c28] px-2 py-0.5 rounded border border-slate-800">
              ⌘ + K prompt
            </span>
          </div>

          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white p-2 rounded-lg transition-all shadow-md shadow-rose-950/40 active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Send className="size-3.5" />
          </button>
        </div>
      </form>

      {/* Footer Disclaimer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1 pt-0.5">
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Escrow Anti-Phishing Shield v4.8
        </span>
        <span>Valve Partner Certified</span>
      </div>
    </div>
  );
}
