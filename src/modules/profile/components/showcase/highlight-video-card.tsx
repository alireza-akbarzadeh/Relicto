"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function HighlightVideoCard({
  videoUrl,
  traderHandle,
  onOpenEdit,
}: {
  videoUrl?: string | null;
  traderHandle: string;
  onOpenEdit?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!videoUrl) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-white/15 bg-surface-card/60 p-4 text-center backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary">
            <Icon name="videocam" className="text-[20px]" />
          </div>
          <div>
            <h4 className="font-headline-sm text-xs font-bold text-text-primary uppercase">
              Trader Highlight Clip
            </h4>
            <p className="font-body-sm text-[11px] text-text-muted">
              Showcase your ace clutches or signature item animations directly on your profile.
            </p>
          </div>
        </div>
        {onOpenEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={onOpenEdit}
            className="h-8 gap-1.5 border-white/15 bg-white/5 font-headline-sm text-[11px] text-text-primary uppercase hover:bg-white/10"
          >
            <Upload className="size-3.5" />
            <span>Upload Video to Sotoon</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-surface-card p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="play_circle" className="text-[18px] text-primary" />
          <span className="font-headline-sm text-xs font-bold tracking-wider text-text-primary uppercase">
            @{traderHandle} Signature Replay
          </span>
          <span className="rounded bg-primary/20 px-2 py-0.5 font-label-badge text-[10px] font-bold text-primary uppercase">
            60 FPS Replay
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 font-data-mono-md text-[10px] text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sotoon Object Storage
          </span>
        </div>
      </div>

      <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-border-subtle bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Overlay controls */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/20">
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary/90 text-on-primary shadow-lg shadow-primary/30 transition-transform group-hover:scale-110 hover:bg-primary"
          >
            {isPlaying ? <Pause className="size-6" /> : <Play className="ml-0.5 size-6" />}
          </Button>
        </div>

        <div className="absolute right-2 bottom-2 z-10 flex items-center gap-2">
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="flex size-7 cursor-pointer items-center justify-center rounded bg-black/70 text-white backdrop-blur-md hover:bg-black"
          >
            {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
