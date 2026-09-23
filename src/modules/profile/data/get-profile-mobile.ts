import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { profileService } from "@/server/modules/profile/profile.service";
import type { ProfileMobile } from "../mobile.types";
import { profileMobile } from "./profile-mobile.mock";

/**
 * Mobile profile: trust, escrow, showcase and link counts from the same records
 * as the desktop profile; bot/node chrome and the security checklist stay authored.
 */
export async function getProfileMobile(): Promise<ProfileMobile> {
  const { ping, botId, node, savedAccounts, security, links } = profileMobile;
  const live = await profileService.mobile(await requireUserId(), { ping, botId, node, savedAccounts, security, links });
  return live ?? profileMobile;
}
