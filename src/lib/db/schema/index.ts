/**
 * One module per domain. Better Auth owns `auth`; everything else is derived
 * from the mock view-models in `src/modules/*` — domain facts only, with
 * presentation (tones, glows, icons) left to the UI layer.
 */
export * from "./auth";
export * from "./catalog";
export * from "./market";
export * from "./cart";
export * from "./orders";
export * from "./wallet";
export * from "./market-data";
export * from "./alerts";
export * from "./notifications";
export * from "./profiles";
export * from "./esports";
export * from "./trade-ups";
