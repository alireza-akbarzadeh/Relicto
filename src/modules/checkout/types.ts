import { IconName } from "@/components/ui/icon";

export type CheckoutItem = {
  id: string;
  /** The reserved copy and its item — how buy buttons recognise a line already in the basket. */
  listingId?: string;
  slug?: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeTone: string;
  game: string;
  gameTone: string;
  name: string;
  subname?: string;
  category?: string;
  detail: string;
  intel: string[];
  bot: string;
  price: number;
  marketPrice?: number;
  discountPercentage?: number;
  wear?: string;
  floatValue?: number;
  paintSeed?: number;
  marker: string;
  markerTone: string;
  icon?: IconName;
};

export type PaymentRail = {
  id: string;
  title: string;
  detail: string;
  note: string;
  icon: IconName;
  badge?: string;
  tone: "primary" | "amber" | "cyan" | "muted";
};

export type CheckoutData = {
  session: string;
  items: CheckoutItem[];
  paymentRails: PaymentRail[];
  subtotal: number;
  comboDiscount: number;
  promoDiscount: number;
  walletAfter: string;
};