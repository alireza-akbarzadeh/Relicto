"use client";

import * as React from "react";
import Image from "next/image";
import { soundEffects } from "@/lib/sound-effects";
import type { ChestSkinItem } from "../types";

const CARD_WIDTH = 160; // Card width in pixels
const CARD_GAP = 12; // Gap in pixels
const STEP = CARD_WIDTH + CARD_GAP;

export function UnboxingReel({
  reelItems,
  winningIndex,
  isSpinning,
  isFastSpin,
  onSpinFinished,
}: {
  reelItems: ChestSkinItem[];
  winningIndex: number;
  isSpinning: boolean;
  isFastSpin: boolean;
  onSpinFinished: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = React.useState(0);
  const [transitionStyle, setTransitionStyle] = React.useState<string>("none");

  // Spin duration: fast spin is 1.2s, regular dramatic spin is 5.8s
  const durationMs = isFastSpin ? 1200 : 5800;

  React.useEffect(() => {
    if (!isSpinning) {
      setTransitionStyle("none");
      setTranslateX(0);
      return;
    }

    soundEffects.playChestUnlock();

    // Calculate final target position:
    // Center of container = containerWidth / 2
    // Target card center = winningIndex * STEP + CARD_WIDTH / 2
    const containerWidth = containerRef.current?.offsetWidth ?? 800;
    // Add small random offset inside the card (+/- 35px) for natural mechanical landing
    const randomCardOffset = (Math.random() - 0.5) * 60;
    const targetOffset = winningIndex * STEP + CARD_WIDTH / 2 - containerWidth / 2 + randomCardOffset;

    // Set transition with custom cubic-bezier deceleration curve
    setTransitionStyle(`transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.22, 1)`);
    setTranslateX(-targetOffset);

    // Audio tick simulation during spin
    let animationFrameId: number;
    const startTime = performance.now();
    let lastTickIndex = -1;

    const tickLoop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Current position using cubic-bezier approximation
      const easedProgress = 1 - Math.pow(1 - progress, 3.5);
      const currentPos = easedProgress * targetOffset;
      const currentCenterIndex = Math.floor((currentPos + containerWidth / 2) / STEP);

      if (currentCenterIndex !== lastTickIndex && currentCenterIndex >= 0) {
        lastTickIndex = currentCenterIndex;
        // Frequency shifts lower as wheel slows down
        const pitchMultiplier = 1.4 - progress * 0.7;
        soundEffects.playTick(pitchMultiplier);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tickLoop);
      }
    };

    animationFrameId = requestAnimationFrame(tickLoop);

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      onSpinFinished();
    }, durationMs + 200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpinning, winningIndex, durationMs, onSpinFinished]);

  const getRarityAccent = (rarity: string) => {
    switch (rarity) {
      case "arcana":
      case "cosmic":
        return "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)] bg-rose-500/10";
      case "immortal":
        return "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] bg-amber-500/10";
      case "mythical":
      case "covert":
        return "border-purple-500 bg-purple-500/10";
      default:
        return "border-cyan-500/60 bg-cyan-500/10";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-56 overflow-hidden rounded-2xl border-2 border-border-subtle bg-canvas-base shadow-2xl"
    >
      {/* Top and Bottom Center Pointers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-tertiary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-tertiary drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      </div>

      {/* Vertical center laser line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-tertiary shadow-[0_0_12px_rgba(245,158,11,0.9)] z-20 pointer-events-none" />

      {/* Left/Right Edge Shadows / Fog */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-canvas-base via-canvas-base/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-canvas-base via-canvas-base/80 to-transparent z-10 pointer-events-none" />

      {/* Reel Track */}
      <div
        ref={trackRef}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
        className="flex items-center h-full px-4 gap-3 select-none"
      >
        {reelItems.map((item, idx) => {
          const accent = getRarityAccent(item.rarity);
          return (
            <div
              key={`${item.id}-${idx}`}
              style={{ width: `${CARD_WIDTH}px`, minWidth: `${CARD_WIDTH}px` }}
              className={`h-44 rounded-xl border-2 flex flex-col items-center justify-between p-2.5 bg-surface-card transition-colors ${accent}`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted truncate w-full text-center">
                {item.rarity}
              </span>

              <div className="relative size-24 overflow-hidden rounded-lg my-1">
                <Image
                  src={item.imageUrl || "/images/lootora/hub-01.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="w-full text-center space-y-0.5">
                <div className="text-xs font-bold text-text-primary truncate">{item.name}</div>
                <div className="text-[10px] font-mono text-tertiary font-semibold">
                  ${item.valueUsd.toFixed(1)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
