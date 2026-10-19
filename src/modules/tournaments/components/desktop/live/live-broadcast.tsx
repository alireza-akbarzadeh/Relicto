"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { formatCompact } from "../../../lib/format";
import type { Broadcast } from "../../../types";
import { BroadcastChatDrawer } from "./broadcast-chat-drawer";
import { BroadcastControls } from "./broadcast-controls";

export function LiveBroadcast({ broadcast }: { broadcast: Broadcast }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="flex flex-col gap-space-md lg:col-span-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <Dot className="h-2.5 w-2.5 bg-status-live" animation="ping" />
          <h2 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">
            Featured Live Broadcast
          </h2>
        </div>
        <div className="flex items-center gap-space-sm font-label-badge text-label-badge text-text-muted">
          <span className="rounded bg-surface-container-high px-2 py-0.5 text-on-surface">{broadcast.quality}</span>
          <span className="flex items-center gap-1 rounded bg-surface-container-high px-2 py-0.5 text-text-secondary">
            <Icon name="visibility" className="text-[14px] text-status-live" />
            {formatCompact(broadcast.viewers)}
          </span>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl">
        <div className="relative aspect-video w-full">
          {isPlaying ? (
            <video
              ref={videoRef}
              src="/media/items/dark-artistry-bracers.webm"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onClick={togglePlay}
              className="h-full w-full object-cover cursor-pointer"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <Image
              src={broadcast.image}
              alt={broadcast.imageAlt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-center"
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t/srgb from-overlay-base/85 via-transparent to-overlay-base/40" />

          {/* Scoreboard banner */}
          <div className="pointer-events-auto absolute top-space-md right-space-md left-space-md flex items-center justify-between z-10">
            <div className="flex items-center gap-space-sm rounded-lg bg-overlay-base/90 px-space-md py-1 backdrop-blur-md">
              <span className="font-headline-sm text-headline-sm text-primary-container">{broadcast.home}</span>
              <span className="px-1 font-data-mono-lg text-data-mono-lg text-text-primary">
                {broadcast.score[0]} : {broadcast.score[1]}
              </span>
              <span className="font-headline-sm text-headline-sm text-secondary">{broadcast.away}</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-status-live px-space-sm py-1 font-label-caps text-label-caps font-bold text-text-primary uppercase shadow-xs">
              <Icon name="sensors" className="text-[14px]" />
              {broadcast.badge}
            </div>
          </div>

          {/* Center Play Button (visible when paused or hover) */}
          <div
            onClick={togglePlay}
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 z-10 ${
              isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
            }`}
          >
            <Button
              type="button"
              variant={null}
              size={null}
              aria-label={isPlaying ? "Pause broadcast" : "Play broadcast"}
              className="flex h-16 w-16 items-center justify-center rounded-full border-0 bg-primary-container/90 text-on-primary shadow-[0_0_32px_rgba(244,63,94,0.6)] transition-transform hover:scale-110"
            >
              {isPlaying ? <Pause className="size-7" /> : <Play className="ml-1 size-7" />}
            </Button>
          </div>

          <BroadcastControls
            broadcast={broadcast}
            chatOpen={chatOpen}
            onToggleChat={() => setChatOpen(!chatOpen)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onToggleFullscreen={toggleFullscreen}
          />

          <BroadcastChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
      </div>
    </div>
  );
}
