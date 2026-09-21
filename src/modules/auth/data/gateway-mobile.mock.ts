import type { IconName } from "@/components/ui/icon";

/** Mobile Steam auth gateway copy (Stitch: "Lootora Mobile — Steam Auth & Security Gateway"). */
export const gatewayMobile = {
  sync: "Steam OpenID 2.0 Synced",
  latency: "LATENCY: 18MS",
  title: "Tactical Gateway",
  lede: "Zero-trust inventory escrow & tier-1 match trade authentication.",
  steam: {
    title: "Steam Fast-Track",
    badge: "0-DAY TRADE HOLD ELIGIBLE",
    body: "Bypasses standard 7-day hold via automated Valve escrow telemetry. Direct sync with active CS2 & Dota 2 armories.",
  },
  uid: "UID #4810-CS",
  guard: {
    device: "Pushed to Pixel 8 Pro (***-892)",
    period: 30,
    start: 24,
    code: ["V", "R", "T", "X", "P"],
  },
  alternatives: [
    { id: "fido", label: "FIDO2 Key", icon: "security_update_good", tone: "text-secondary" },
    { id: "discord", label: "Discord VIP", icon: "hub", tone: "text-primary" },
    { id: "google", label: "Google Key", icon: "passkey", tone: "text-tertiary" },
  ] satisfies { id: string; label: string; icon: IconName; tone: string }[],
  audit: ["AUDIT #9928-VALVE", "ZERO RETENTION POLICY"],
};

export type GatewayMobile = typeof gatewayMobile;
