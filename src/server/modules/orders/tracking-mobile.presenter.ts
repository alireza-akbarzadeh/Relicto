import type { MobileEscrowStep, TrackingMobile } from "@/modules/orders/mobile.types";
import { stamp } from "./tracking.copy";
import type { TrackingInput } from "./tracking.presenter";

/** Stitch chrome of the mobile tracker — protocol banner, cipher and link telemetry. */
const CHROME = {
  protocol: "ESCROW PROTOCOL // V2.44",
  cipher: "TLS 1.3",
  intro: "Verify these exact bot attributes in your Steam Guard trade window before approving:",
  telemetry: [
    { tone: "cyan", label: "WS: 9ms" },
    { icon: "pulse_alert", tone: "amber", label: "VALVE API: 99.99%" },
    { icon: "phonelink_lock", tone: "indigo", label: "2FA SYNCED" },
  ] satisfies TrackingMobile["telemetry"],
};

/** The mobile timeline keys its four steps by role, not by position. */
const STEP_IDS = ["locked", "dispatch", "offer", "release"];
const WEAR: Record<string, string> = { fn: "FACTORY NEW", mw: "MINIMAL WEAR", ft: "FIELD-TESTED", ww: "WELL-WORN", bs: "BATTLE-SCARRED" };
const LOCK: Record<string, string> = { escrow: "VAULT LOCKED", completed: "RELEASED", cancelled: "REFUNDED", disputed: "DISPUTED" };

/** "Kuro_Vault" → "KV", "KuroSkins" → "KU": two letters either way, like the design's avatar. */
function initials(name: string) {
  const parts = name.replace(/[^A-Za-z0-9 _]/g, "").split(/[\s_]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? "RV").slice(0, 2);
  return letters.toUpperCase();
}

function toStep(event: TrackingInput["events"][number], input: TrackingInput): MobileEscrowStep {
  const state = event.state === "queued" ? "pending" : event.state;
  const offer = input.offer;

  return {
    id: STEP_IDS[event.step - 1] ?? event.id,
    state,
    title: event.title,
    stamp: state === "done" ? stamp(event.occurredAt) : state === "active" ? "ACTIVE" : "PENDING",
    // The live step swaps its prose for the two codes the buyer has to match.
    ...(state === "active" && offer?.steamOfferId
      ? {
          details: [
            { label: "Bot Security Token:", value: offer.token ?? "—", tone: "cyan" as const },
            { label: "Trade ID:", value: offer.steamOfferId, tone: "plain" as const },
          ],
        }
      : { body: event.body ?? "" }),
  };
}

/** The same escrow record as the desktop tracker, in the mobile tracker's shape. */
export function toTrackingMobile(input: TrackingInput, now = new Date()): TrackingMobile {
  const { order, line, offer, vendor } = input;
  const elapsed = Math.floor((now.getTime() - order.placedAt.getTime()) / 1000);
  const sellerName = vendor?.handle ?? order.counterpartyName ?? "Relicto Vault";
  const botName = offer?.botName ?? "Relicto Sentinel Bot";

  return {
    protocol: CHROME.protocol,
    code: `#${order.code}`,
    cipher: CHROME.cipher,
    // The window closes with the escrow's auto-cancel; a settled order has none left.
    offerWindowSeconds: order.state === "escrow" ? Math.max(0, (order.autoCancelSeconds ?? 0) - elapsed) : 0,
    item: {
      image: order.thumbnailUrl ?? input.itemImage ?? "",
      imageAlt: order.thumbnailAlt ?? input.itemImageAlt ?? line?.nameSnapshot ?? "Traded item",
      rarity: [input.rarity?.toUpperCase(), input.gameName?.toUpperCase()].filter(Boolean).join(" • ") || "STEAM ITEM",
      wear: line?.wear ? WEAR[line.wear] : (line?.attributes?.styleNote?.toUpperCase() ?? "—"),
      float: line?.float !== null && line?.float !== undefined ? line.float.toFixed(8) : "—",
      name: line?.nameSnapshot ?? "Traded item",
      finish: line?.detailSnapshot ?? line?.attributes?.styleNote ?? "",
      priceUsd: order.totalCents / 100,
      lock: LOCK[order.state] ?? "VAULT LOCKED",
    },
    seller: {
      initials: initials(sellerName),
      name: sellerName,
      since: vendor?.tier ? `${vendor.tier} Merchant` : "Verified Relicto merchant",
      trust: vendor ? `${vendor.trustScore / 10}% TRUST` : "VERIFIED",
    },
    steps: input.events.map((event) => toStep(event, input)),
    tradeOfferUrl: offer?.offerUrl ? `steam://openurl/${offer.offerUrl}` : "https://steamcommunity.com/tradeoffer/",
    shield: {
      intro: CHROME.intro,
      facts: [
        { label: "OFFICIAL BOT NAME", value: botName, truncate: true },
        { label: "STEAM LEVEL / AGE", value: [offer?.botLevel, offer?.botSince].filter(Boolean).join(" • ") || "Pending dispatch" },
      ],
      passphrase: offer?.token ?? "Issued with the trade offer",
    },
    telemetry: CHROME.telemetry,
  };
}
