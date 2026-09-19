import type { Arena } from "../components/sign-up/arena-picker";

/** Prefilled values shown on the Stitch sign-up screen (mock session). */
export const SIGN_UP_DEFAULTS = {
  gamertag: "Vort3x_Sniper",
  email: "alex@majorops.gg",
  password: "K@7#mP99xQ!vL0",
  confirm: "K@7#mP99xQ!vL0",
  referral: "TI14-MAJOR-VIP",
  arena: "multi" as Arena,
  acceptTerms: true,
  webhooks: true,
};
