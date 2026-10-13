"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { updateProfileDetails } from "../../actions/profile";
import { AVATAR_PRESETS, ProfileAvatarPicker } from "./profile-avatar-picker";

const ROLES = ["Trader", "Arbitrageur", "Collector", "Market Maker", "Sentinel Auditor"];

export interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    handle: string;
    realName?: string | null;
    alias?: string | null;
    role?: string | null;
    avatar?: string | null;
    tradeUrl?: string | null;
  };
}

export function ProfileEditModal({ open, onOpenChange, initialData }: ProfileEditModalProps) {
  const [handle, setHandle] = useState(initialData.handle || "");
  const [realName, setRealName] = useState(initialData.realName || "");
  const [alias, setAlias] = useState(initialData.alias || "");
  const [role, setRole] = useState(initialData.role || "Trader");
  const [avatar, setAvatar] = useState(initialData.avatar || AVATAR_PRESETS[0]);
  const [tradeUrl, setTradeUrl] = useState(initialData.tradeUrl || "");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      toast.error("Trader handle cannot be blank");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateProfileDetails({
          handle: handle.trim().replace(/^@/, ""),
          realName: realName.trim() || null,
          alias: alias.trim() || null,
          role,
          avatar: avatar.trim() || null,
          tradeUrl: tradeUrl.trim() || null,
        });

        if (result.success) {
          toast.success("Profile updated successfully", {
            description: `Your identity is live as @${result.handle}.`,
          });
          onOpenChange(false);
        } else {
          toast.error("Failed to update profile", {
            description: result.error,
          });
        }
      } catch {
        toast.error("Communication error", {
          description: "Could not reach the profile service. Please try again.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-white/10 bg-surface-card p-6 shadow-2xl">
        <DialogHeader className="gap-1 pb-2">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="tune" className="text-[20px]" />
            <DialogTitle className="font-headline-sm text-lg font-bold tracking-wider text-text-primary uppercase">
              Edit Trader Profile
            </DialogTitle>
          </div>
          <DialogDescription className="font-body-sm text-xs text-text-secondary">
            Customize your public persona, gamertag alias, role badge, and Steam Trade escrow coordinates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          <ProfileAvatarPicker avatar={avatar} setAvatar={setAvatar} />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Trader Handle
              </label>
              <div className="relative">
                <span className="absolute top-2.5 left-2.5 font-data-mono-md text-xs text-text-muted">@</span>
                <Input
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="kuro_skins"
                  className="h-9 border-white/10 bg-surface-container-lowest pl-7 font-data-mono-md text-xs text-text-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Gamertag Alias
              </label>
              <Input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Kuro"
                className="h-9 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Real Name (Optional)
              </label>
              <Input
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="Alex Vance"
                className="h-9 border-white/10 bg-surface-container-lowest text-xs text-text-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Role Badge
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-9 rounded-md border border-white/10 bg-surface-container-lowest px-2.5 font-data-mono-md text-xs text-text-primary focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-surface-card text-text-primary">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Steam Trade URL
              </label>
              <a
                href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                target="_blank"
                rel="noreferrer"
                className="font-label-badge text-[10px] text-tertiary underline hover:text-white"
              >
                Find your trade URL
              </a>
            </div>
            <Input
              value={tradeUrl}
              onChange={(e) => setTradeUrl(e.target.value)}
              placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
              className="h-9 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              className="h-9 border-white/15 bg-transparent font-headline-sm text-xs text-text-secondary uppercase hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="h-9 gap-1.5 border-0 bg-primary px-4 font-headline-sm text-xs font-bold text-on-primary uppercase shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              <Icon name={pending ? "progress_activity" : "check"} className={`text-[16px] ${pending ? "animate-spin" : ""}`} />
              <span>{pending ? "Saving..." : "Save Identity"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
