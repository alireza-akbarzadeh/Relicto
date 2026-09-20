import type { IconName } from "@/components/ui/icon";

export type WikiTone = "primary" | "amber" | "cyan" | "indigo" | "muted";
export type WikiGuide = { id: string; category: string; categoryTone: WikiTone; title: string; summary: string; meta: string; icon: IconName; tone: WikiTone; kind: "phase" | "seed" | "gem" | "formula" };
export type WikiRevision = { id: string; title: string; path: string; author: string; trust: string; commit: string; changes: string; time: string; tone: WikiTone };
export type WikiData = { guides: WikiGuide[]; revisions: WikiRevision[] };
