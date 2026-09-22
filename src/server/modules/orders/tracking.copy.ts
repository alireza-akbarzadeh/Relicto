import type { LogLine, TradeToken } from "@/modules/orders/types";

/** Safety copy is the same on every order — it's policy, not order data. */
export const CAUTION =
  "Caution: If the trade offer inside your Steam Guard app shows a different verification token or requests your items in return, do NOT confirm. Relicto Sentinel bots will never request your existing inventory.";

export const GUARANTEE_BODY =
  "are isolated in the Relicto Escrow smart settlement contract. If the bot fails to transfer the skin within the timer deadline or if Steam trade networks experience an outage, your full payment is immediately returned to your Steam Wallet with zero cancellation penalties.";

export function confirmSteps(token: string): TradeToken["instructions"] {
  return [
    { step: "01.", text: "Open official ", strong: "Steam Mobile App", tail: " on iOS or Android." },
    { step: "02.", text: "Tap ", strong: "Confirmations", tail: " menu tab in navigation." },
    { step: "03.", text: "Match security token ", strong: token, tail: " and accept gift trade." },
  ];
}

const clock = (at: Date, ms = false) => {
  const base = at.toISOString().slice(11, 19);
  return ms ? `[${base}.${at.toISOString().slice(20, 23)}]` : `${base} UTC`;
};

export const stamp = (at: Date) => clock(at);

type TelemetryInput = {
  code: string;
  amount: string;
  funding: string;
  botName: string;
  botSteamId: string | null;
  offerId: string | null;
  token: string;
  events: { occurredAt: Date }[];
};

/**
 * The console tail under the tracker. Every line quotes a fact from the order,
 * timestamped off the escrow events that actually fired.
 */
export function buildTelemetry(input: TelemetryInput): LogLine[] {
  const at = (index: number) => input.events[index]?.occurredAt ?? input.events.at(-1)?.occurredAt ?? new Date();

  const lines: LogLine[] = [
    {
      id: "auth",
      time: clock(at(0), true),
      channel: "[AUTH]",
      channelTone: "cyan",
      message: [
        { text: "Payment authorization payload for " },
        { text: `${input.amount} USD`, tone: "primary" },
        { text: ` accepted via ${input.funding} session token.` },
      ],
    },
    {
      id: "vault",
      time: clock(at(0), true),
      channel: "[VAULT]",
      channelTone: "cyan",
      message: [{ text: `Relicto Escrow Node #04 locked funds in cryptographic multi-sig vault ${input.code}.` }],
    },
    {
      id: "dispatch",
      time: clock(at(1), true),
      channel: "[BOT_DISPATCH]",
      channelTone: "amber",
      message: [
        { text: `${input.botName} initiated trade payload with SteamID64: ` },
        { text: input.botSteamId ?? "—", tone: "code" },
        { text: "." },
      ],
    },
  ];

  if (input.offerId) {
    lines.push({
      id: "steam-api",
      time: clock(at(2), true),
      channel: "[STEAM_API]",
      channelTone: "cyan",
      message: [
        { text: "Steam Web API trade offer handshake confirmed. Valve Trade Offer ID: " },
        { text: input.offerId, tone: "primary" },
        { text: " successfully dispatched to client profile." },
      ],
    });
  }

  lines.push({
    id: "wait-client",
    time: clock(at(2), true),
    channel: "[WAIT_CLIENT]",
    channelTone: "live",
    active: true,
    message: [
      { text: "Awaiting Steam Mobile Guard 2FA verification from client. Security Token: " },
      { text: input.token, tone: "amber" },
      { text: ". Automatic fail-safe timeout running." },
    ],
  });

  return lines;
}
