import type { Arena } from "../components/sign-up/arena-picker";

/** Initial (empty) state of the sign-up form. */
export const SIGN_UP_DEFAULTS = {
  gamertag: "",
  email: "",
  password: "",
  confirm: "",
  referral: "",
  arena: "multi" as Arena,
  acceptTerms: false,
  webhooks: true,
};
