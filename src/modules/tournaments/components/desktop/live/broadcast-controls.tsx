"use client";

import { Volume2, VolumeX, Maximize2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Broadcast } from "../../../types";

export interface BroadcastControlsProps {
  broadcast: Broadcast;
  chatOpen: boolean;
  onToggleChat: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export function BroadcastControls({
  broadcast,
  chatOpen,
  onToggleChat,
  isMuted,
  onToggleMute,
  onToggleFullscreen,
}: BroadcastControlsProps) {
  return (
    <div className="absolute right-space-md bottom-space-md left-space-md flex flex-wrap items-center justify-between gap-space-sm rounded-lg bg-overlay-base/90 p-space-sm backdrop-blur-md z-15">
      <div className="flex items-center gap-space-md">
        <div className="flex flex-col">
          <span className="font-label-caps text-[10px] text-text-muted uppercase">CASTERS</span>
          <span className="font-label-caps text-label-caps text-text-primary">{broadcast.casters}</span>
        </div>
        <div className="hidden flex-col sm:flex">
          <span className="font-label-caps text-[10px] text-text-muted uppercase">GOLD ADVANTAGE</span>
          <span className="font-data-mono-md text-data-mono-md text-tertiary">{broadcast.goldAdvantage}</span>
        </div>
      </div>
      <div className="flex items-center gap-space-xs">
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={onToggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="flex size-8 cursor-pointer items-center justify-center rounded border-0 bg-surface-container-high text-text-primary transition-colors hover:bg-surface-bright"
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={onToggleChat}
          className={`flex items-center gap-1.5 rounded border-0 px-space-md py-1 font-label-caps text-label-caps uppercase transition-colors ${
            chatOpen ? "bg-primary text-on-primary font-bold shadow-sm" : "bg-surface-container-high text-text-primary hover:bg-surface-bright"
          }`}
        >
          <MessageSquare className="size-3.5" />
          <span>{chatOpen ? "Hide Chat" : "Live Chat"}</span>
        </Button>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={onToggleFullscreen}
          aria-label="Toggle Fullscreen"
          className="flex size-8 cursor-pointer items-center justify-center rounded border-0 bg-surface-container-high text-text-primary transition-colors hover:bg-surface-bright"
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
