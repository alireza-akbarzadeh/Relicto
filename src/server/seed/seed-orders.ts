/**
 * Trade ledger + live escrow, seeded to mirror `history.mock` / `tracking.mock`
 * so `/orders` and `/orders/[id]` render the same screens against Postgres.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";

type Db = NodePgDatabase<typeof schema>;
type Order = typeof schema.orders.$inferInsert;
type Line = typeof schema.orderItems.$inferInsert;

type SeedOrder = Pick<
  Order,
  | "code" | "flow" | "state" | "totalCents" | "feeCents" | "placedAt" | "autoCancelSeconds"
  | "fundingLabel" | "settlementNote" | "counterpartyKind" | "counterpartyName" | "counterpartyNote"
  | "thumbnailUrl" | "thumbnailAlt"
> &
  Pick<Line, "nameSnapshot" | "detailSnapshot" | "attributes"> & { slug: string };

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const img = (n: string) => `/images/lootora/order-history-${n}.jpg`;

/** Yesterday at a fixed UTC clock time, so the ledger's second row keeps its stamp. */
function yesterdayAt(now: number, hours: number, minutes: number) {
  const at = new Date(now - DAY);
  at.setUTCHours(hours, minutes, 0, 0);
  return at;
}

/** Dates are relative to the seed run so the feed always reads as live. */
const ORDERS = (now: number): SeedOrder[] => [
  {
    code: "LT-89410-ES", slug: "manifold-paradox", flow: "buy", state: "escrow",
    totalCents: 11850, feeCents: 0, placedAt: new Date(now - 2 * MINUTE), autoCancelSeconds: 8 * 60 + 42,
    fundingLabel: "Steam Wallet", settlementNote: "Fee $0.00 (Escrow)",
    counterpartyKind: "bot", counterpartyName: "Bot Sentinel #42", counterpartyNote: "Security PIN: 9021",
    thumbnailUrl: img("01"), thumbnailAlt: "Manifold Paradox arcana blades glowing cyan and crimson",
    nameSnapshot: "Phantom Assassin", detailSnapshot: "Manifold Paradox (Style 3 Cleared)",
    attributes: {
      styleNote: "Style 3 Unlocked", killsBadge: "1,420 Arcana Kills", variantBadge: "Corrupted Blood",
      slotLabel: "Phantom Assassin Weapon & Armor Slot",
      specs: [
        { label: "Socket Gem 01", value: "Inscribed Kills" },
        { label: "Trade Lock", value: "Tradable Instantly", highlight: true },
      ],
    },
  },
  {
    code: "LT-87219-DL", slug: "butterfly-doppler", flow: "sell", state: "completed",
    totalCents: 315000, feeCents: 3780, placedAt: yesterdayAt(now, 18, 30), autoCancelSeconds: null,
    fundingLabel: "Payout to Bank (SEPA)", settlementNote: "Fee 1.2% Paid",
    counterpartyKind: "merchant", counterpartyName: "ValkyrieTrading", counterpartyNote: "Verified Merchant",
    thumbnailUrl: img("02"), thumbnailAlt: "Butterfly knife with a sapphire Doppler Phase 4 finish",
    nameSnapshot: "Butterfly Knife | Doppler", detailSnapshot: "Phase 4 • Factory New (0.014 Float)",
    attributes: { styleNote: "Phase 4" },
  },
  {
    code: "LT-85102-CS", slug: "dragonclaw-hook", flow: "buy", state: "completed",
    totalCents: 16400, feeCents: 0, placedAt: new Date(now - 30 * DAY), autoCancelSeconds: null,
    fundingLabel: "Crypto (USDC Vault)", settlementNote: "Instant Gasless",
    counterpartyKind: "bot", counterpartyName: "AegisVault #09", counterpartyNote: "Direct Escrow",
    thumbnailUrl: img("03"), thumbnailAlt: "Dragonclaw Hook of bone and rusted iron under green mist",
    nameSnapshot: "Dragonclaw Hook", detailSnapshot: "Vintage Clean (Socketed 0/0)", attributes: {},
  },
  {
    code: "LT-84991-GL", slug: "sport-gloves-vice", flow: "buy", state: "completed",
    totalCents: 142000, feeCents: 0, placedAt: new Date(now - 36 * DAY), autoCancelSeconds: null,
    fundingLabel: "Steam Balance", settlementNote: "Protected P2P",
    counterpartyKind: "user", counterpartyName: "KuroSkins_PRO", counterpartyNote: "Community Seller",
    thumbnailUrl: img("04"), thumbnailAlt: "Sport Gloves Vice in neon magenta and cyan",
    nameSnapshot: "Sport Gloves | Vice", detailSnapshot: "Field-Tested (0.21 Float)", attributes: {},
  },
  {
    code: "LT-81203-LQ", slug: "awp-fade", flow: "liquidate", state: "completed",
    totalCents: 128000, feeCents: 0, placedAt: new Date(now - 44 * DAY), autoCancelSeconds: null,
    fundingLabel: "Instant Pool 0-Sec", settlementNote: "Instant Yield",
    counterpartyKind: "pool", counterpartyName: "RelictoLiquidityPool", counterpartyNote: "Automated MM",
    thumbnailUrl: img("05"), thumbnailAlt: "AWP Fade with a pink and gold gradient finish",
    nameSnapshot: "AWP | Fade", detailSnapshot: "99.4% Fade Index (Seed 415)", attributes: {},
  },
  {
    code: "LT-79944-AR", slug: "dark-artistry-cape", flow: "buy", state: "completed",
    totalCents: 8900, feeCents: 0, placedAt: new Date(now - 50 * DAY), autoCancelSeconds: null,
    fundingLabel: "Steam Balance", settlementNote: "Zero Fee Promo",
    counterpartyKind: "bot", counterpartyName: "Bot Sentinel #14", counterpartyNote: "Auto Handoff",
    thumbnailUrl: img("06"), thumbnailAlt: "Invoker's Dark Artistry Cape with violet arcane glyphs",
    nameSnapshot: "Dark Artistry Cape", detailSnapshot: "Invoker Immortal Mantle", attributes: {},
  },
];

type Step = Pick<typeof schema.escrowEvents.$inferInsert, "step" | "state" | "title" | "body">;

const ESCROW_STEPS = (placedAt: Date): (Step & { occurredAt: Date })[] =>
  ([
  { step: 1, state: "done", title: "Escrow Vault Funded", offset: 0,
    body: "$118.50 secured in multsig smart lock via Steam Wallet authorization token." },
  { step: 2, state: "done", title: "Bot Security Audit", offset: 14000,
    body: "SHA-256 payload verified. Steam Guard API check clear. Anti-phishing seal matched." },
  { step: 3, state: "active", title: "Trade Offer Dispatched", offset: 24000,
    body: "Valve Steam Trade Offer #948201 dispatched. Awaiting mobile confirmation." },
  { step: 4, state: "queued", title: "Settlement & Inventory Vault", offset: 25000,
    body: "Asset permanently bound to your linked Steam profile and escrow payout released to vendor." },
  ] as (Step & { offset: number })[]).map(({ offset, ...step }) => ({
    ...step,
    occurredAt: new Date(placedAt.getTime() + offset),
  }));

/** `traderId` is the account whose ledger this is; `vaultId` stands in for the far side. */
export async function seedOrders(db: Db, traderId: string, vaultId: string, vendorId: string) {
  const now = Date.now();

  for (const o of ORDERS(now)) {
    const orderId = `order-${o.code.toLowerCase()}`;
    const inbound = o.flow !== "buy";
    // Order #1 is the one the live tracker opens, so it gets the real vendor.
    const counterpartyId = o.code === "LT-89410-ES" ? vendorId : vaultId;

    const values = {
      id: orderId,
      code: o.code,
      buyerId: inbound ? counterpartyId : traderId,
      sellerId: inbound ? traderId : counterpartyId,
      flow: o.flow,
      state: o.state,
      subtotalCents: o.totalCents,
      feeCents: o.feeCents,
      totalCents: o.totalCents,
      placedAt: o.placedAt,
      completedAt: o.state === "completed" ? o.placedAt : null,
      autoCancelSeconds: o.autoCancelSeconds,
      fundingLabel: o.fundingLabel,
      settlementNote: o.settlementNote,
      counterpartyKind: o.counterpartyKind,
      counterpartyName: o.counterpartyName,
      counterpartyNote: o.counterpartyNote,
      thumbnailUrl: o.thumbnailUrl,
      thumbnailAlt: o.thumbnailAlt,
    } satisfies typeof schema.orders.$inferInsert;

    await db.insert(schema.orders).values(values).onConflictDoUpdate({ target: schema.orders.id, set: values });

    const line = {
      id: `${orderId}-line`,
      orderId,
      listingId: `listing-${o.slug}`,
      itemId: `item-${o.slug}`,
      nameSnapshot: o.nameSnapshot,
      detailSnapshot: o.detailSnapshot,
      priceCents: o.totalCents,
      attributes: o.attributes,
    } satisfies typeof schema.orderItems.$inferInsert;

    await db.insert(schema.orderItems).values(line).onConflictDoUpdate({ target: schema.orderItems.id, set: line });
  }

  await seedLiveEscrow(db, new Date(now - 2 * MINUTE));
}

/** The four-step timeline and Steam trade offer behind order #LT-89410-ES. */
async function seedLiveEscrow(db: Db, placedAt: Date) {
  const orderId = "order-lt-89410-es";

  for (const step of ESCROW_STEPS(placedAt)) {
    const row = {
      id: `${orderId}-step-${step.step}`,
      orderId,
      step: step.step,
      state: step.state,
      title: step.title,
      body: step.body,
      occurredAt: step.occurredAt,
    } satisfies typeof schema.escrowEvents.$inferInsert;

    await db.insert(schema.escrowEvents).values(row).onConflictDoUpdate({ target: schema.escrowEvents.id, set: row });
  }

  const offer = {
    id: `${orderId}-offer`,
    orderId,
    steamOfferId: "948201",
    botName: "Relicto Sentinel Bot #42",
    botSteamId: "76561198082340192",
    botLevel: "Steam Lvl 150",
    botSince: "Steam Member Since 2018",
    token: "984-KZT",
    offerUrl: "https://steamcommunity.com/tradeoffer/",
    status: "sent",
    latencyMs: 18,
  } satisfies typeof schema.tradeOffers.$inferInsert;

  await db.insert(schema.tradeOffers).values(offer).onConflictDoUpdate({ target: schema.tradeOffers.id, set: offer });
}
