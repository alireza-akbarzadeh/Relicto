"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/cn";

export interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  contentClassName,
}: ResponsiveDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent
          className={cn(
            "max-h-[92vh] flex flex-col bg-surface-card border-t border-border-subtle p-0 overflow-hidden text-on-surface",
            contentClassName,
          )}
        >
          {(title || description) && (
            <DrawerHeader className="border-b border-border-subtle/50 px-4 py-3 shrink-0 text-left">
              {title && <DrawerTitle className="font-heading text-base font-bold text-text-primary">{title}</DrawerTitle>}
              {description && <DrawerDescription className="text-xs text-text-muted">{description}</DrawerDescription>}
            </DrawerHeader>
          )}
          <div className={cn("flex-1 overflow-y-auto no-scrollbar", className)}>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-4xl max-h-[88vh] flex flex-col bg-surface-card border-border-subtle p-0 overflow-hidden shadow-2xl text-on-surface",
          contentClassName,
        )}
      >
        {(title || description) && (
          <DialogHeader className="border-b border-border-subtle/50 px-6 py-4 shrink-0 text-left">
            {title && <DialogTitle className="font-heading text-lg font-bold text-text-primary">{title}</DialogTitle>}
            {description && <DialogDescription className="text-xs text-text-muted">{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className={cn("flex-1 overflow-y-auto no-scrollbar", className)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
