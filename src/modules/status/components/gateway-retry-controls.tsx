"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type GatewayRetryControlsProps = {
  onRetry?: () => void;
  initialSeconds?: number;
  initialAttempt?: number;
  maxAttempts?: number;
};

/** Auto-ping countdown and manual retry from the Stitch gateway error page. */
export function GatewayRetryControls({ onRetry, initialSeconds = 14, initialAttempt = 3, maxAttempts = 10 }: GatewayRetryControlsProps) {
  const [countdown, setCountdown] = useState(initialSeconds);
  const [attempt, setAttempt] = useState(initialAttempt);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        setAttempt((a) => (a >= maxAttempts ? 1 : a + 1));
        setSpinning(true);
        window.setTimeout(() => setSpinning(false), 1200);
        return 15;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [maxAttempts]);

  const handleRetry = () => {
    setCountdown(15);
    setSpinning(true);
    window.setTimeout(() => setSpinning(false), 1200);
    onRetry?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleRetry}
        className="flex items-center gap-space-sm rounded bg-primary-container px-space-lg py-space-md font-label-caps text-label-caps text-on-primary-container uppercase shadow-lg shadow-primary-container/20 transition-all hover:brightness-110"
      >
        <Icon name="refresh" className={cn("text-[18px]", spinning && "animate-spin")} />
        <span>Retry Connection Now</span>
      </button>
      <div className="flex max-w-xl items-center gap-space-sm rounded bg-surface-deep p-space-sm shadow-inner">
        <div className="h-2 w-2 animate-pulse rounded-full bg-status-upcoming" />
        <span className="font-data-mono-md text-data-mono-md text-text-secondary">
          Automatically pinging Valve edge nodes in <span className="font-bold text-tertiary">{countdown}s</span>... (Attempt {attempt} of {maxAttempts})
        </span>
      </div>
    </>
  );
}
