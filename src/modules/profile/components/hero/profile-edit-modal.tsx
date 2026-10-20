"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { ProfileEditForm, type ProfileFormInitialData } from "./profile-edit-form";

export interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProfileFormInitialData;
}

export function ProfileEditModal({
  open,
  onOpenChange,
  initialData,
}: ProfileEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg! border border-white/10 bg-surface-card p-6 shadow-2xl">
        <DialogHeader className="gap-1 pb-1">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="tune" className="text-[20px]" />
            <DialogTitle className="font-headline-sm text-lg font-bold tracking-wider text-text-primary uppercase">
              Edit Trader Profile &amp; Media
            </DialogTitle>
          </div>
          <DialogDescription className="font-body-sm text-xs text-text-secondary">
            Manage your Sotoon S3 avatars, video clips, gamertag alias, and Steam Trade escrow coordinates.
          </DialogDescription>
        </DialogHeader>

        <ProfileEditForm
          initialData={initialData}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
