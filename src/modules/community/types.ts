import type { IconName } from "@/components/ui/icon";

export type CommunityTone = "primary" | "amber" | "cyan" | "indigo" | "muted";
export type CommunityPost = { id: string; initials: string; handle: string; role: string; roleTone: CommunityTone; age: string; tag: string; tagTone: CommunityTone; title: string; body: string; image?: string; metric?: { label: string; value: string; delta: string }; likes: number; comments: number };
export type CommunityGuild = { name: string; detail: string; symbol: string; tone: CommunityTone };
export type CommunityData = { posts: CommunityPost[]; guilds: CommunityGuild[] };
