"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, user } from "@/lib/db/schema";
import { fetchSteamPersona } from "@/lib/steam/openid";
import { getUserId, requireUserId } from "@/modules/relicto/data/get-session";
import { storageService, type UploadResult } from "@/server/modules/storage/storage.service";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEOS = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export type UploadActionResult =
  | { success: true; url: string; provider: "sotoon" | "local"; kind: string }
  | { success: false; error: string };

/**
 * Uploads user profile media (avatar, banner, highlight gameplay video)
 * to Sotoon Object Storage (https://sotoon.ir/products/object-storage)
 * with automatic local fallback during development.
 */
export async function uploadProfileMedia(formData: FormData): Promise<UploadActionResult> {
  try {
    const file = formData.get("file") as File | null;
    const kind = ((formData.get("kind") as string) || "avatar") as "avatars" | "banners" | "videos";

    if (!file || file.size === 0) {
      return { success: false, error: "No file was provided for upload" };
    }

    const isVideo = kind === "videos";
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    const allowed = isVideo ? ALLOWED_VIDEOS : ALLOWED_IMAGES;

    if (file.size > maxBytes) {
      return { success: false, error: `File size exceeds the limit (${isVideo ? "50MB" : "10MB"})` };
    }

    if (!allowed.has(file.type)) {
      return {
        success: false,
        error: `Unsupported format (${file.type}). Allowed: ${Array.from(allowed).join(", ")}`,
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded: UploadResult = await storageService.uploadFile({
      buffer,
      filename: file.name,
      contentType: file.type,
      folder: kind,
    });

    // Update the database record if user is authenticated
    const currentUserId = await getUserId();
    if (currentUserId) {
      if (kind === "avatars") {
        await db.update(profiles).set({ avatar: uploaded.url, updatedAt: new Date() }).where(eq(profiles.userId, currentUserId));
        await db.update(user).set({ image: uploaded.url, updatedAt: new Date() }).where(eq(user.id, currentUserId));
      } else if (kind === "banners") {
        await db.update(profiles).set({ banner: uploaded.url, updatedAt: new Date() }).where(eq(profiles.userId, currentUserId));
      } else if (kind === "videos") {
        await db.update(profiles).set({ highlightVideo: uploaded.url, updatedAt: new Date() }).where(eq(profiles.userId, currentUserId));
      }

      revalidatePath("/", "layout");
      revalidatePath("/profile");
    }

    return { success: true, url: uploaded.url, provider: uploaded.provider, kind };
  } catch (err) {
    console.error("[uploadProfileMedia] Failed to process media upload:", err);
    return { success: false, error: err instanceof Error ? err.message : "Media upload processing failed" };
  }
}

/**
 * Fetches the user's avatar from Steam, transfers it to Sotoon Object Storage,
 * and updates their public profile and account.
 */
export async function syncSteamAvatarAction(): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  try {
    const userId = await requireUserId();
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

    // Use linked Steam ID, or fallback to the sample trader identity
    const steamId = profile?.steamId || "76561198082348819";
    let persona = await fetchSteamPersona(steamId);

    // Direct fallback from Steam community public XML if API key is not configured
    if (!persona.avatar) {
      try {
        const xmlRes = await fetch(`https://steamcommunity.com/profiles/${steamId}/?xml=1`, { signal: AbortSignal.timeout(8_000) });
        if (xmlRes.ok) {
          const xmlText = await xmlRes.text();
          const avatarMatch = xmlText.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/);
          const nameMatch = xmlText.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/);
          if (avatarMatch?.[1]) {
            persona = { name: nameMatch?.[1] || persona.name, avatar: avatarMatch[1] };
          }
        }
      } catch (xmlErr) {
        console.warn("[syncSteamAvatarAction] Steam XML scrape fallback skipped:", xmlErr);
      }
    }

    if (!persona.avatar) {
      return { success: false, error: "Could not retrieve avatar from Steam. Ensure your Steam profile is public." };
    }

    // Persist Steam avatar to Sotoon Object Storage
    const uploaded = await storageService.syncSteamAvatar(steamId, persona.avatar);

    await db.update(profiles).set({ avatar: uploaded.url, updatedAt: new Date() }).where(eq(profiles.userId, userId));
    await db.update(user).set({ image: uploaded.url, updatedAt: new Date() }).where(eq(user.id, userId));

    revalidatePath("/", "layout");
    revalidatePath("/profile");

    return { success: true, avatarUrl: uploaded.url };
  } catch (err) {
    console.error("[syncSteamAvatarAction] Error synchronizing Steam avatar:", err);
    return { success: false, error: err instanceof Error ? err.message : "Could not sync Steam avatar" };
  }
}
