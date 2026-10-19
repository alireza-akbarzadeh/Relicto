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
      <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-surface-container-lowest">
        <video
          ref={videoRef}
          src={video.url}
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity group-hover:bg-black/10">
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary/90 text-on-primary shadow-xl shadow-primary/40 transition-transform hover:scale-110"
          >
            {isPlaying ? <Pause className="size-7" /> : <Play className="ml-1 size-7" />}
          </Button>
        </div>

        <div className="absolute right-3 bottom-3 z-10 flex items-center gap-2">
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={() => {
              if (!videoRef.current) return;
              videoRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }}
            className="flex size-8 cursor-pointer items-center justify-center rounded bg-black/75 text-white backdrop-blur-md hover:bg-black"
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/5 bg-surface-container-lowest/80 px-3 py-2 text-xs">
        <span className="font-label-caps text-[10px] text-text-muted uppercase">Scene Quick-Jump:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {video.markers.map((marker) => (
            <Button
              key={marker.time}
              type="button"
              variant={null}
              size={null}
              onClick={() => seekTo(marker.time)}
              className="h-6 rounded border border-white/10 bg-white/5 px-2 font-data-mono-md text-[10px] text-text-primary hover:border-primary hover:text-primary"
            >
              {marker.label} ({marker.time}s)
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
