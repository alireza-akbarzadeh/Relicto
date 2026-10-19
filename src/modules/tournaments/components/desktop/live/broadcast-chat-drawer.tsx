"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ChatMessage = {
  id: string;
  author: string;
  badge?: string;
  badgeColor?: string;
  text: string;
  time: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", author: "Volohatiy", badge: "VIP", badgeColor: "text-amber-400", text: "That blink dagger positioning was surgical!", time: "12:41" },
  { id: "2", author: "Kuro_Vault", badge: "Trader", badgeColor: "text-cyan-400", text: "Notice the Dark Artistry custom sound cues on the kill?", time: "12:42" },
  { id: "3", author: "S1mple_CS", badge: "PRO", badgeColor: "text-primary", text: "GG, game 2 draft will determine the series.", time: "12:43" },
  { id: "4", author: "AegisHunter", text: "Roshan respawning in 45 seconds!", time: "12:44" },
];

export function BroadcastChatDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      author: "You",
      badge: "Trader",
      badgeColor: "text-primary",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  if (!open) return null;

  return (
    <div className="absolute top-0 right-0 bottom-0 z-20 flex w-72 sm:w-80 flex-col border-l border-white/10 bg-surface-card/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between border-b border-white/10 p-3 bg-surface-container-lowest/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <span className="font-headline-sm text-xs font-bold text-text-primary uppercase tracking-wider">
            Live Spectator Chat
          </span>
          <span className="size-2 rounded-full bg-status-live animate-ping" />
        </div>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={onClose}
          className="flex size-6 cursor-pointer items-center justify-center rounded text-text-muted hover:text-white"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 font-data-mono-md text-[10px]">
              {msg.badge && (
                <span className={`font-bold ${msg.badgeColor || "text-primary"}`}>
                  [{msg.badge}]
                </span>
              )}
              <span className="font-bold text-text-primary">{msg.author}:</span>
              <span className="text-text-muted text-[9px]">{msg.time}</span>
            </div>
            <p className="font-body-sm text-[11px] text-text-secondary pl-1 mt-0.5">
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-white/10 p-2.5 bg-surface-container-lowest/90 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send match prediction..."
          className="h-8 border-white/10 bg-white/5 font-body-sm text-xs text-text-primary placeholder:text-text-muted"
        />
        <Button
          type="submit"
          disabled={!input.trim()}
          className="size-8 p-0 shrink-0 border-0 bg-primary text-on-primary hover:bg-primary/90"
        >
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}
