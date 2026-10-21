"use client";

import * as React from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CopilotHeader } from "./copilot-header";
import { CopilotTelemetry } from "./copilot-telemetry";
import { CopilotQuickCodex } from "./copilot-quick-codex";
import { CopilotMessages } from "./copilot-messages";
import { CopilotOmnibar } from "./copilot-omnibar";
import { CopilotSettingsDialog } from "./copilot-settings-dialog";
import { sendChatMessageAction } from "../actions/copilot-chat";
import { resolveSentinelLocalKnowledge } from "../data/copilot-resolver";
import { playSentinelChime } from "../utils/copilot-sound";
import { sendPushNotification, requestPushPermission } from "../utils/copilot-notify";
import type { CopilotMessage, CopilotMode, TradeDiagnostic } from "../types";

interface CopilotWindowProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function CopilotWindow({ onClose, isMobile }: CopilotWindowProps) {
  const tInit = useTranslations("copilot.initial");
  const tToasts = useTranslations("copilot.toasts");

  const buildInitialMessages = React.useCallback((): CopilotMessage[] => [
    {
      id: "init-welcome",
      role: "assistant",
      content: tInit("welcome"),
      timestamp: tInit("timestamp"),
      diagnostic: {
        tradeId: "#94821",
        assetName: tInit("assetName"),
        counterparty: "@DendiLover99",
        counterpartyLevel: 148,
        steamId64: "76561198034821990",
        escrowStatus: tInit("escrowStatus"),
        isVerified: true,
        floatValue: "0.0821 (Field-Tested)",
        checks: [
          tInit("check1"),
          tInit("check2"),
          tInit("check3"),
        ],
      },
    },
  ], [tInit]);

  const [messages, setMessages] = React.useState<CopilotMessage[]>(() => buildInitialMessages());
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<CopilotMode>("copilot");
  const [model, setModel] = React.useState("gemini-3.8-flash");
  const [latencyMs, setLatencyMs] = React.useState(11);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSendMessage = async (text: string) => {
    if (pushEnabled) requestPushPermission().catch(() => {});

    const userMsg: CopilotMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      let result: { reply: string; diagnostic?: TradeDiagnostic; latencyMs?: number; modelUsed?: string } | null = null;

      // Tier 1: Dedicated Node.js API Route with 8.5s timeout
      try {
        const fetchRes = await fetch("/api/copilot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history, modelOverride: model }),
        });
        if (fetchRes.ok || fetchRes.status === 429) {
          result = await fetchRes.json();
          if (fetchRes.status === 429) toast.warning(tToasts("rateLimit"));
        }
      } catch {
        // Fallback to Tier 2
      }

      // Tier 2: Next.js Server Action with built-in resolver
      if (!result?.reply) {
        result = await sendChatMessageAction({ message: text, history, modelOverride: model });
      }

      if (result) {
        const botMsg: CopilotMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: result.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          diagnostic: result.diagnostic,
        };

        setMessages((prev) => [...prev, botMsg]);
        setLatencyMs(result.latencyMs || 15);

        if (soundEnabled) playSentinelChime();
        if (pushEnabled) sendPushNotification({ body: result.reply });
      }
    } catch {
      // Tier 3: Zero-latency client-side deterministic resolver
      const offline = resolveSentinelLocalKnowledge(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: offline.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          diagnostic: offline.diagnostic,
        },
      ]);
      if (soundEnabled) playSentinelChime();
    } finally {
      setLoading(false);
    }
  };

  const sendRef = React.useRef(handleSendMessage);
  React.useEffect(() => {
    sendRef.current = handleSendMessage;
  });

  React.useEffect(() => {
    const handleQuery = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        sendRef.current(customEvent.detail);
      }
    };
    window.addEventListener("relicto:open-copilot-query", handleQuery);
    return () => window.removeEventListener("relicto:open-copilot-query", handleQuery);
  }, []);

  return (
    <div
      className={`w-full bg-[#0e121b]/95 backdrop-blur-xl border border-rose-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(244,63,94,0.18)] flex flex-col overflow-hidden relative ${
        isMobile ? "h-full rounded-none" : "rounded-2xl h-[780px] max-h-[88vh]"
      }`}
    >
      <div className="absolute -top-24 -right-24 size-52 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <CopilotHeader
        currentMode={mode}
        onModeChange={setMode}
        audioEnabled={soundEnabled}
        onToggleAudio={() => {
          setSoundEnabled(!soundEnabled);
          if (!soundEnabled) {
            playSentinelChime();
            toast.success(tToasts("soundEnabled"));
          } else {
            toast.info(tToasts("soundMuted"));
          }
        }}
        pushEnabled={pushEnabled}
        onTogglePush={async () => {
          if (!pushEnabled) {
            const perm = await requestPushPermission();
            if (perm === "granted") {
              setPushEnabled(true);
              toast.success(tToasts("pushEnabled"));
            } else {
              toast.error(tToasts("pushBlocked"));
            }
          } else {
            setPushEnabled(false);
            toast.info(tToasts("pushMuted"));
          }
        }}
        onClearSession={() => {
          setMessages(buildInitialMessages());
          toast.info(tToasts("sessionCleared"));
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onClose={onClose}
      />

      <CopilotTelemetry modelName={model} latencyMs={latencyMs} />

      {(mode === "codex" || mode === "copilot") && (
        <CopilotQuickCodex onSelectPrompt={handleSendMessage} />
      )}

      <CopilotMessages messages={messages} loading={loading} />

      <CopilotOmnibar onSendMessage={handleSendMessage} disabled={loading} />

      <CopilotSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        activeModel={model}
        onModelChange={(newModel) => {
          setModel(newModel);
          toast.success(tToasts("modelUpdated", { model: newModel }));
        }}
        soundEnabled={soundEnabled}
        onSoundChange={setSoundEnabled}
        pushEnabled={pushEnabled}
        onPushChange={setPushEnabled}
      />
    </div>
  );
}
