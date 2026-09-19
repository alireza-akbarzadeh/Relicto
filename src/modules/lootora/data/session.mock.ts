import type { AppNotification, SessionUser } from "../session.types";

export const sessionUser: SessionUser = {
  handle: "S1mple_CS",
  level: 94,
  role: "PRO SELLER",
  verified: true,
  steamSynced: true,
  walletUsd: 142.5,
};

export const notifications: AppNotification[] = [
  {
    id: "n-offer-awp",
    icon: "check_circle",
    tone: "success",
    title: "Offer accepted",
    body: "Your $1,280.00 bid on AWP | Fade was accepted. Escrow is locking the item.",
    time: "2m ago",
    href: "/orders/LT-88291",
    unread: true,
  },
  {
    id: "n-price-paradox",
    icon: "trending_up",
    tone: "info",
    title: "Price alert: Manifold Paradox",
    body: "Floor moved +8.6% in 24h after Patch 7.38c. You follow this item.",
    time: "14m ago",
    href: "/marketplace?q=Manifold%20Paradox",
    unread: true,
  },
  {
    id: "n-guard",
    icon: "phonelink_ring",
    tone: "warning",
    title: "Steam Guard confirmation needed",
    body: "Confirm the outgoing trade for Dragonclaw Hook in the Steam app within 10 minutes.",
    time: "1h ago",
    href: "/verify",
    unread: false,
  },
  {
    id: "n-payout",
    icon: "account_balance_wallet",
    tone: "success",
    title: "Payout settled",
    body: "$412.00 from M4A1-S | Printstream was released to your wallet.",
    time: "Yesterday",
    href: "/wallet",
    unread: false,
  },
];
