"use client";

import * as React from "react";
import Link from "next/link";
import { Info, AlertTriangle, ShieldAlert, CheckCircle2, X, ExternalLink } from "lucide-react";

interface BroadcastBannerProps {
  settings?: {
    announcementActive: boolean;
    activeAnnouncement?: string | null;
    announcementSeverity: "info" | "warning" | "critical" | "success";
    announcementLink?: string | null;
  } | null;
}

const SEVERITY_CONFIG = {
  info: {
    bg: "bg-cyan-950/70 border-cyan-500/30 text-cyan-200",
    icon: Info,
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    label: "NOTICE",
  },
  warning: {
    bg: "bg-amber-950/70 border-amber-500/30 text-amber-200",
    icon: AlertTriangle,
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    label: "ATTENTION",
  },
  critical: {
    bg: "bg-rose-950/70 border-rose-500/30 text-rose-200",
    icon: ShieldAlert,
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    label: "SECURITY",
  },
  success: {
    bg: "bg-emerald-950/70 border-emerald-500/30 text-emerald-200",
    icon: CheckCircle2,
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    label: "UPDATE",
  },
};

export function BroadcastBanner({ settings }: BroadcastBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (
    !settings ||
    !settings.announcementActive ||
    !settings.activeAnnouncement ||
    dismissed
  ) {
    return null;
  }

  const severity = settings.announcementSeverity || "info";
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const IconComponent = config.icon;

  return (
    <aside
      aria-label="Platform Announcement"
      className={`relative z-40 border-b backdrop-blur-md px-4 py-2 transition-all duration-300 ${config.bg}`}
    >
      <div className="container mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span
            className={`flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${config.badgeBg}`}
          >
            <IconComponent className="size-3 shrink-0" />
            {config.label}
          </span>
          <p className="truncate font-medium text-slate-100">
            {settings.activeAnnouncement}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {settings.announcementLink && (
            <Link
              href={settings.announcementLink}
              className="flex items-center gap-1 font-mono text-[11px] font-semibold underline underline-offset-2 hover:text-white transition-colors"
            >
              <span>Learn more</span>
              <ExternalLink className="size-3" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
