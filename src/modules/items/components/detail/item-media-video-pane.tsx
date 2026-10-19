"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItemMediaData } from "../../data/item-media.mock";

export function ItemMediaVideoPane({ video }: { video: ItemMediaData["video"] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black shadow-inner">
        <video
          ref={videoRef}
          src={video.url}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          className="h-full w-full cursor-pointer object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Center overlay button - fades away while playing and appears on hover/pause */}
        <div
          onClick={togglePlay}
          className={`absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 transition-all duration-300 ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="flex size-14 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md shadow-2xl transition-transform hover:scale-110 hover:border-primary hover:text-primary">
            {isPlaying ? <Pause className="size-6" /> : <Play className="ml-1 size-6" />}
          </div>
        </div>

        {/* Bottom player controls bar */}
        <div className="absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={togglePlay}
              className="flex size-7 cursor-pointer items-center justify-center rounded text-white transition-colors hover:text-primary"
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <span className="font-data-mono-md text-[11px] text-text-secondary">
              {video.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-data-mono-md text-[10px] text-emerald-400">
              {video.fps} • {video.resolution}
            </span>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => {
                if (!videoRef.current) return;
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }}
              className="flex size-7 cursor-pointer items-center justify-center rounded text-white transition-colors hover:text-primary"
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline quick jump markers */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-surface-container-lowest px-4 py-2 text-xs">
        <span className="font-label-caps text-[11px] font-bold text-text-muted uppercase">Scene Telemetry:</span>
        <div className="flex flex-wrap items-center gap-2">
          {video.markers.map((marker) => (
            <Button
              key={marker.time}
              type="button"
              variant={null}
              size={null}
              onClick={() => seekTo(marker.time)}
              className="h-6 rounded border border-white/10 bg-white/5 px-2.5 font-data-mono-md text-[11px] text-text-primary transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
            >
              {marker.label} ({marker.time}s)
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
