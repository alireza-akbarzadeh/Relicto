"use client";

import * as React from "react";
import { Gift, Coins, Sparkles, CheckCircle2, Flame } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { soundEffects } from "@/lib/sound-effects";

export function DailyBonusDialog({
  open,
  onOpenChange,
  onClaimSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaimSuccess?: (newBalance: number) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [claimed, setClaimed] = React.useState(false);

  const STREAK_DAYS = [
    { day: 1, coins: 50, status: "completed" },
    { day: 2, coins: 75, status: "completed" },
    { day: 3, coins: 100, status: "today" },
    { day: 4, coins: 150, status: "locked" },
    { day: 5, coins: 200, status: "locked" },
    { day: 6, coins: 300, status: "locked" },
    { day: 7, coins: 500, status: "locked", jackpot: true },
  ];

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chests/daily-bonus", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to claim daily bonus");
        return;
      }

      soundEffects.playCoin();
      setClaimed(true);
      toast.success("Claimed +100 Daily Relicto Coins!");
      onClaimSuccess?.(data.newBalance);
    } catch {
      toast.error("Network error claiming reward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Daily Login Loyalty Drops"
      description="Log in each day to compound your streak and claim free unboxing credits"
      className="sm:max-w-[540px]"
    >
      <div className="space-y-4 pt-2">
        {/* Streak headline */}
        <div className="flex items-center justify-between rounded-xl border border-tertiary/30 bg-tertiary/10 p-3">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-tertiary animate-bounce" />
            <div>
              <div className="text-xs font-mono font-bold text-text-primary">3-Day Streak Active</div>
              <div className="text-[11px] text-text-muted">Come back tomorrow for +150 RC</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-tertiary px-2 py-0.5 rounded bg-tertiary/20">
            Multiplier 1.2x
          </span>
        </div>

        {/* 7-Day calendar */}
        <div className="grid grid-cols-7 gap-1.5">
          {STREAK_DAYS.map((d) => {
            const isToday = d.status === "today";
            const isCompleted = d.status === "completed";

            return (
              <div
                key={d.day}
                className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                  isToday
                    ? "border-tertiary bg-tertiary/20 shadow-sm shadow-tertiary/30"
                    : isCompleted
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-border-subtle bg-surface-container opacity-60"
                }`}
              >
                <span className="text-[10px] font-mono font-semibold text-text-muted">D{d.day}</span>
                <Coins className={`size-4 my-1 ${isToday ? "text-tertiary" : isCompleted ? "text-emerald-400" : "text-text-muted"}`} />
                <span className="text-[10px] font-mono font-bold">{d.coins}</span>
                {isCompleted && <CheckCircle2 className="size-2.5 text-emerald-400 mt-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <Button
          size="default"
          onClick={handleClaim}
          disabled={loading || claimed}
          className="w-full gap-2 font-bold bg-primary text-on-primary hover:bg-primary/90 shadow-md"
        >
          <Gift className="size-4" />
          {claimed ? "Claimed For Today" : loading ? "Claiming Coins..." : "Claim +100 Relicto Coins"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
