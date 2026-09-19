/**
 * Every Material Symbol the app renders. The font request is subset to exactly
 * this list, so add a name here before using it — `IconName` enforces that.
 */
export const ICON_NAMES = [
  "account_balance_wallet",
  "account_tree",
  "arrow_forward",
  "bolt",
  "bomb",
  "dns",
  "equalizer",
  "event",
  "expand_more",
  "flash_on",
  "forum",
  "fullscreen",
  "gps_fixed",
  "grid_view",
  "groups",
  "live_tv",
  "local_fire_department",
  "lock",
  "login",
  "military_tech",
  "monetization_on",
  "notifications",
  "payments",
  "person",
  "person_add",
  "play_arrow",
  "public",
  "radar",
  "search",
  "security",
  "sensors",
  "shield",
  "shield_person",
  "shield_with_heart",
  "smart_display",
  "smart_toy",
  "speed",
  "sports_esports",
  "sports_kabaddi",
  "star",
  "stars",
  "swords",
  "sync",
  "sync_alt",
  "timer",
  "trophy",
  "tune",
  "verified",
  "verified_user",
  "visibility",
  "workspace_premium",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Google Fonts requires `icon_names` sorted alphabetically. */
export const ICON_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" +
  `&icon_names=${[...ICON_NAMES].sort().join(",")}&display=block`;
