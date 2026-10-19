"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { syncSteamAvatarAction, uploadProfileMedia } from "../../actions/media";
import { AVATAR_PRESETS } from "./profile-avatar-picker";

export function ProfileMediaUpload({
  avatar,
  setAvatar,
  highlightVideo,
  setHighlightVideo,
}: {
  avatar: string;
  setAvatar: (val: string) => void;
  highlightVideo: string;
  setHighlightVideo: (val: string) => void;
}) {
  const [syncingSteam, startSteamTransition] = useTransition();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "avatars");

    try {
      const res = await uploadProfileMedia(formData);
      if (res.success) {
        setAvatar(res.url);
        toast.success("Profile avatar uploaded", {
          description: `Stored on ${res.provider === "sotoon" ? "Sotoon Cloud (s3.thr1.sotoon.ir)" : "local storage"}.`,
        });
      } else {
        toast.error("Avatar upload failed", { description: res.error });
      }
    } catch {
      toast.error("Upload error", { description: "Could not reach storage provider." });
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "videos");

    try {
      const res = await uploadProfileMedia(formData);
      if (res.success) {
        setHighlightVideo(res.url);
        toast.success("Highlight video uploaded", {
          description: `Stored on ${res.provider === "sotoon" ? "Sotoon Cloud (s3.thr1.sotoon.ir)" : "local storage"}.`,
        });
      } else {
        toast.error("Video upload failed", { description: res.error });
      }
    } catch {
      toast.error("Video upload error", { description: "Could not reach storage provider." });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleSyncSteam = () => {
    startSteamTransition(async () => {
      try {
        const res = await syncSteamAvatarAction();
        if (res.success && res.avatarUrl) {
          setAvatar(res.avatarUrl);
          toast.success("Steam avatar synced to Sotoon Cloud", {
            description: "Your official Steam avatar has been imported and stored.",
          });
        } else {
          toast.error("Steam avatar sync failed", { description: res.error });
        }
      } catch {
        toast.error("Sync error", { description: "Failed to communicate with Steam or Sotoon." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-surface-container-lowest/80 p-3.5">
      <div className="flex items-center justify-between">
        <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
          Portrait & Media Storage (Sotoon S3)
        </label>
        <span className="flex items-center gap-1 font-data-mono-md text-[10px] text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sotoon S3 Ready
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-primary/40 bg-surface-container-highest shadow-inner">
          <Image src={avatar || AVATAR_PRESETS[0]} alt="Avatar preview" fill className="object-cover" />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
            <Button
              type="button"
              variant="outline"
              disabled={uploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="h-8 gap-1.5 border-white/15 bg-white/5 px-2.5 font-headline-sm text-[11px] text-text-primary uppercase hover:bg-white/10"
            >
              <Icon name={uploadingAvatar ? "progress_activity" : "publish"} className={`text-[14px] ${uploadingAvatar ? "animate-spin" : ""}`} />
              <span>{uploadingAvatar ? "Uploading..." : "Upload Image"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={syncingSteam}
              onClick={handleSyncSteam}
              className="h-8 gap-1.5 border-white/15 bg-steam-navy/80 px-2.5 font-headline-sm text-[11px] text-steam-blue uppercase hover:bg-steam-navy"
            >
              <Icon name={syncingSteam ? "progress_activity" : "sync"} className={`text-[14px] ${syncingSteam ? "animate-spin" : ""}`} />
              <span>{syncingSteam ? "Syncing..." : "Sync Steam Avatar"}</span>
            </Button>
          </div>
          <p className="font-data-mono-md text-[10px] text-text-muted">
            Direct upload or 1-click import from Steam to Sotoon Object Storage.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-[10px] font-bold text-text-muted uppercase">
            Gameplay Highlight Video
          </span>
          {highlightVideo && (
            <span className="font-data-mono-md text-[9px] text-tertiary">Active Video Bound</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" onChange={handleVideoFileChange} className="hidden" />
          <Button
            type="button"
            variant="outline"
            disabled={uploadingVideo}
            onClick={() => videoInputRef.current?.click()}
            className="h-7 gap-1 border-white/15 bg-white/5 px-2 font-headline-sm text-[10px] text-text-secondary uppercase hover:bg-white/10"
          >
            <Icon name={uploadingVideo ? "progress_activity" : "videocam"} className={`text-[13px] ${uploadingVideo ? "animate-spin" : ""}`} />
            <span>{uploadingVideo ? "Uploading Video..." : "Upload MP4 / WebM"}</span>
          </Button>
          <input
            type="text"
            value={highlightVideo}
            onChange={(e) => setHighlightVideo(e.target.value)}
            placeholder="Or enter video URL (e.g. /media/items/dark-artistry-bracers.webm)"
            className="h-7 flex-1 rounded border border-white/10 bg-surface-container-lowest px-2 font-data-mono-md text-[10px] text-text-primary"
          />
        </div>
      </div>
    </div>
  );
}
