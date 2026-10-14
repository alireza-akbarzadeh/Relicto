"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  type ChatMessageDto,
  loadMatchChatMessages,
  sendMatchChatMessage,
} from "../../actions/match-chat";

type MatchSpectatorChatProps = {
  matchId: string;
  teamTags: [string, string];
};

const CHEER_SNIPPETS = ["🔥 Let's go!", "🛡️ Hold the line!", "💰 Easy 2-0!", "⚡ Unreal play!"];

export function MatchSpectatorChat({ matchId, teamTags }: MatchSpectatorChatProps) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    loadMatchChatMessages(matchId)
      .then((data) => {
        if (active) setMessages(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [matchId]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputMsg).trim();
    if (!text) return;

    const optimisticId = `temp-${messages.length + 1}`;
    const optimisticMessage: ChatMessageDto = {
      id: optimisticId,
      matchId,
      userId: "temp",
      userHandle: "You",
      userAvatar: "/avatars/trader-1.png",
      message: text,
      teamTag: selectedTag,
      createdAt: new Date(0),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    if (!textToSend) setInputMsg("");

    startTransition(async () => {
      try {
        const saved = await sendMatchChatMessage({
          matchId,
          message: text,
          teamTag: selectedTag ?? undefined,
        });
        setMessages((prev) => prev.map((m) => (m.id === optimisticId ? saved : m)));
      } catch {
        toast.info("Sign in to join spectator chat", {
          description: "Spectator chat is open to all verified arena traders.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Messages stream */}
      <div className="flex flex-col gap-2 max-h-[200px] min-h-[160px] overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-2 rounded bg-surface-container-lowest/60 p-2 text-xs">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-bold text-[10px] text-primary">
              {m.userHandle.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-[11px] font-bold text-text-primary">
                  {m.userHandle}
                </span>
                {m.teamTag && (
                  <span className="rounded bg-primary/20 px-1 py-0.2 font-label-caps text-[9px] text-primary font-bold">
                    {m.teamTag}
                  </span>
                )}
                <span className="text-[10px] text-text-muted ml-auto font-data-mono-md">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <span className="text-text-secondary text-[11px] mt-0.5 break-words">{m.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cheer chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {teamTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-label-caps transition-colors shrink-0",
              selectedTag === tag
                ? "bg-primary text-on-primary font-bold"
                : "bg-surface-container-high/60 text-text-muted hover:text-text-primary",
            )}
          >
            Cheer {tag}
          </button>
        ))}
        {CHEER_SNIPPETS.map((snip) => (
          <button
            key={snip}
            type="button"
            onClick={() => handleSend(snip)}
            className="rounded bg-surface-container-low px-2 py-0.5 text-[10px] text-text-secondary hover:text-text-primary transition-colors shrink-0 border border-white/5"
          >
            {snip}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Chat as spectator${selectedTag ? ` (Cheering ${selectedTag})` : ""}...`}
          className="h-8 text-xs bg-surface-container-lowest border-white/10"
        />
        <Button
          type="submit"
          disabled={!inputMsg.trim() || isPending}
          size="sm"
          className="h-8 px-3 bg-primary text-on-primary hover:bg-primary/90"
        >
          <Icon name="send" className="text-[14px]" />
        </Button>
      </form>
    </div>
  );
}
