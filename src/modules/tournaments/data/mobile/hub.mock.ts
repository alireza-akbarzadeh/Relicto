import type { MobileShell } from "../../shell.types";
import type {
  BentoItem,
  Championship,
  QuickChip,
  RadarMatch,
  ServerStatus,
} from "../../mobile.types";

export const mobileShell: MobileShell = {
  brand: { name: "Relicto", accent: "Arena" },
  tierBadge: "Tier-1 Major",
  liveCount: 3,
  tabs: [
    { id: "arena", label: "Arena", icon: "trophy", href: "/tournaments" },
    { id: "market", label: "Market", icon: "storefront", href: "/marketplace" },
    { id: "brackets", label: "Brackets", icon: "account_tree", href: "#brackets" },
    { id: "live", label: "Live", icon: "sensors", href: "#radar-feed", badge: true },
    { id: "profile", label: "Profile", icon: "person", href: "/profile" },
  ],
  activeTab: "arena",
};

export const mobileGameTabs = [
  { value: "all", label: "All Arenas" },
  { value: "dota2", label: "Dota 2" },
  { value: "cs2", label: "CS2" },
] as const;

export const championship: Championship = {
  badge: { icon: "workspace_premium", label: "TI14 & BLAST Circuit" },
  status: "Active",
  title: "Valve Arena",
  highlight: "Major 2025",
  description:
    "Official Valve Anti-Cheat authenticated tournaments. Open qualifiers, double elimination brackets.",
  stats: [
    { label: "Prize Pool", value: "$1,250,000", tone: "amber", emphasis: "strong" },
    { label: "Contenders", value: "48.2k Squads", tone: "strong" },
    { label: "Tickrate", value: "128 Hz Sub", tone: "cyan" },
  ],
  primaryAction: { label: "Enter Qualifier", icon: "swords" },
  secondaryAction: { label: "Streams", icon: "smart_display" },
};

export const searchPlaceholder = "Search tournaments, teams, brackets...";

export const quickChips: QuickChip[] = [
  { icon: "monetization_on", label: "High Stakes ($10K+)", tone: "amber", active: true },
  { icon: "verified_user", label: "VAC+ Verified", tone: "cyan" },
  { icon: "person", label: "Solo Queue", tone: "primary" },
];

export { radarMatches, radarSection } from "./radar.mock";

export const infrastructureSection = { title: "Tactical Infrastructure" };

export const bentoItems: BentoItem[] = [
  { icon: "security", tone: "primary", title: "VAC+ Protocol", description: "Kernel-level anti-cheat telemetry verification." },
  { icon: "bolt", tone: "amber", title: "Zero-Lag Nodes", description: "Direct 128-tick Valve dedicated game servers." },
  { icon: "account_balance_wallet", tone: "cyan", title: "Instant Payouts", description: "Steam Wallet & crypto wire settled post-match." },
  { icon: "sync_alt", tone: "indigo", title: "Steam ID Sync", description: "Automated MMR and rank seed calibration." },
];

export const serverStatus: ServerStatus = {
  icon: "dns",
  title: "Stockholm & Frankfurt",
  description: "All Valve game coordinators nominal",
  ping: "14ms Ping",
};
