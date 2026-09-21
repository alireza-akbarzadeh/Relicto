import "server-only";
import type { ProfileMobile } from "../mobile.types";
import { profileMobile } from "./profile-mobile.mock";

/** Mobile profile payload (trust, escrow, security, showcase, shortcuts). */
export async function getProfileMobile(): Promise<ProfileMobile> {
  return profileMobile;
}
