import type { WikiData } from "../types";

export const wiki: WikiData = {
  guides: [
    { id: "doppler", category: "CS2 Engine Spec", categoryTone: "primary", title: "★ Doppler & Gamma Doppler Phase Science", summary: "Source 2 physical lighting shifts on Anodized Multicolored texture shaders. Photometric rendering breakdown of smoke reflection, specular index variance, and the 7 canonical rarity subclasses.", meta: "14 min read · 42 Revision Trees", icon: "query_stats", tone: "primary", kind: "phase" },
    { id: "blue-gem", category: "Seed Geography", categoryTone: "cyan", title: "Case Hardened Blue Gem Index", summary: "Playside polygon surface mapping for AK-47, Karambit, and Butterfly Knives. Definitive registry of #661 'Scar', #387, #321, and Tier-1 blue distribution metrics.", meta: "1,000 Seeds Cataloged", icon: "gps_fixed", tone: "cyan", kind: "seed" },
    { id: "prismatic", category: "Dota 2 Economy", categoryTone: "amber", title: "Dota 2 Prismatic Gem & Particle Matrix", summary: "Socketing mechanics, artificer's hammer extraction attrition, and canonical RGB spectrum values for Unusual Couriers, TB Arcanas, and Witch Doctor Death Ward.", meta: "Includes Ethereal Flame & Trail of Burning Doom", icon: "flare", tone: "amber", kind: "gem" },
    { id: "float", category: "Valve Trade Contract", categoryTone: "indigo", title: "Float Math & Trade-Up Decimal Engineering", summary: "Precise floating-point 32-bit IEEE 754 precision math. Mathematical proofs on outcome clamping, average input manipulation, and hitting sub-0.0001 collector floats.", meta: "Verified against 1.2M Contract logs", icon: "finance_mode", tone: "indigo", kind: "formula" },
  ],
  revisions: [
    { id: "r1", title: "★ Butterfly Knife | Doppler Phase 2 Max Pink", path: "ROOT / FINISHES / CS2 / KNIVES", author: "@Anomalous_Quant", trust: "Master Archivist", commit: "commit:84c219", changes: "Updated CS2 Subsurface Scattering Index for blade tip highlight (Source 2 release patch)", time: "12m ago", tone: "amber" },
    { id: "r2", title: "Case Hardened AK-47 Seed #151 (Tier 1 Blue)", path: "ROOT / CASE HARDENED / AK", author: "@ZipeI_Audit", trust: "Steam Dev Alumni", commit: "commit:3a91bb4", changes: "Corrected playside dustcover blue ratio from 88.2% to 89.15% via raw vector UV render", time: "1h 42m ago", tone: "cyan" },
    { id: "r3", title: "Dota 2 · Baby Roshan (Prismatic: Midas Gold)", path: "ROOT / DOTA 2 / COURIERS / PRISMATICS", author: "@IceFrogScholar", trust: "Senior Meta Fellow", commit: "commit:e110b99", changes: "Logged Artificer Hammer non-destructive extraction bug mitigation for legacy 2012 Unusuals", time: "4h 10m ago", tone: "primary" },
    { id: "r4", title: "Float Normalization: CS2 Souvenir Desert Eagle", path: "ROOT / ENGINE / 12754", author: "@MatrixSolver", trust: "Quant Peer", commit: "commit:772a6f0", changes: "Added boundary proof for 0.000000000000 float rounding precision in 64-bit Linux client", time: "8h 15m ago", tone: "muted" },
  ],
};
