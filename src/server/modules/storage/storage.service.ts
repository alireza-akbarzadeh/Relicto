import "server-only";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs/promises";
import path from "node:path";
import { getSotoonPublicUrl, getSotoonS3Client, isSotoonConfigured, SOTOON_CONFIG } from "./sotoon.client";

export type UploadResult = {
  url: string;
  key: string;
  provider: "sotoon" | "local";
  sizeBytes: number;
  contentType: string;
};

export type UploadFolder = "avatars" | "banners" | "videos" | "items" | "general";

export type UploadOptions = {
  buffer: Buffer;
  filename: string;
  contentType: string;
  folder?: UploadFolder;
};

const ALLOWED_FOLDERS = new Set<UploadFolder>(["avatars", "banners", "videos", "items", "general"]);

const SAFE_EXTENSIONS = new Set<string>([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".mp4",
  ".webm",
  ".mov",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const ALLOWED_STEAM_HOSTS = new Set<string>([
  "avatars.steamstatic.com",
  "avatars.cloudflare.steamstatic.com",
  "steamcdn-a.akamaihd.net",
  "community.cloudflare.steamstatic.com",
  "steamcommunity.com",
]);

class StorageService {
  /** Uploads a file to Sotoon Object Storage or falls back to local disk with strict path containment. */
  async uploadFile({ buffer, filename, contentType, folder = "general" }: UploadOptions): Promise<UploadResult> {
    const safeFolder: UploadFolder = ALLOWED_FOLDERS.has(folder) ? folder : "general";

    // Sanitize filename and strictly bind extension to approved media types
    const rawExt = path.extname(filename).toLowerCase();
    const safeExt = SAFE_EXTENSIONS.has(rawExt) ? rawExt : (MIME_TO_EXT[contentType] || ".bin");
    const rawBase = path.basename(filename, rawExt);
    const safeBase = rawBase.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 50) || "upload";
    const safeFilename = `${Date.now()}-${safeBase}${safeExt}`;
    const key = `${safeFolder}/${safeFilename}`;

    const s3 = getSotoonS3Client();
    if (s3 && isSotoonConfigured()) {
      try {
        await s3.send(
          new PutObjectCommand({
            Bucket: SOTOON_CONFIG.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: "public-read",
          }),
        );

        const url = getSotoonPublicUrl(key);
        console.info(`[Storage] Uploaded to Sotoon Object Storage: ${url}`);
        return {
          url,
          key,
          provider: "sotoon",
          sizeBytes: buffer.length,
          contentType,
        };
      } catch (err) {
        console.warn("[Storage] Sotoon upload failed, falling back to local storage:", err);
      }
    }

    // Local disk fallback with strict directory traversal prevention
    const baseUploadsDir = path.resolve(process.cwd(), "public", "uploads");
    const uploadDir = path.resolve(baseUploadsDir, safeFolder);
    const localFilePath = path.resolve(uploadDir, safeFilename);

    if (!localFilePath.startsWith(baseUploadsDir + path.sep)) {
      throw new Error("Security violation: Path traversal detected in storage path");
    }

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(localFilePath, buffer);

    const localUrl = `/uploads/${safeFolder}/${safeFilename}`;
    console.info(`[Storage] Saved to local storage fallback: ${localUrl}`);

    return {
      url: localUrl,
      key,
      provider: "local",
      sizeBytes: buffer.length,
      contentType,
    };
  }

  /** Validates CDN origin and fetches a trader's avatar from Steam CDN to store securely. */
  async syncSteamAvatar(steamId: string, steamAvatarUrl: string): Promise<UploadResult> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(steamAvatarUrl);
    } catch {
      throw new Error("Invalid Steam avatar URL format");
    }

    if (parsedUrl.protocol !== "https:") {
      throw new Error("Steam avatar URL must use HTTPS");
    }

    if (!ALLOWED_STEAM_HOSTS.has(parsedUrl.hostname.toLowerCase())) {
      throw new Error(`Untrusted Steam avatar CDN origin: ${parsedUrl.hostname}`);
    }

    const res = await fetch(parsedUrl.href, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`Failed to fetch avatar from Steam CDN: ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const cleanSteamId = steamId.replace(/[^0-9]/g, "") || "trader";

    return this.uploadFile({
      buffer,
      filename: `steam-${cleanSteamId}.jpg`,
      contentType,
      folder: "avatars",
    });
  }
}

export const storageService = new StorageService();
