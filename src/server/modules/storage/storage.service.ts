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

export type UploadOptions = {
  buffer: Buffer;
  filename: string;
  contentType: string;
  folder?: "avatars" | "banners" | "videos" | "items" | "general";
};

class StorageService {
  /** Uploads a file to Sotoon Object Storage or falls back to local disk. */
  async uploadFile({ buffer, filename, contentType, folder = "general" }: UploadOptions): Promise<UploadResult> {
    const sanitizedName = filename.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const key = `${folder}/${Date.now()}-${sanitizedName}`;
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

    // Local disk fallback for local development or when Sotoon credentials are unconfigured
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadDir, { recursive: true });
    const localFilePath = path.join(uploadDir, path.basename(key));
    await fs.writeFile(localFilePath, buffer);

    const localUrl = `/uploads/${folder}/${path.basename(key)}`;
    console.info(`[Storage] Saved to local storage fallback: ${localUrl}`);

    return {
      url: localUrl,
      key,
      provider: "local",
      sizeBytes: buffer.length,
      contentType,
    };
  }

  /** Fetches a trader's avatar from Steam and stores it in Sotoon Object Storage. */
  async syncSteamAvatar(steamId: string, steamAvatarUrl: string): Promise<UploadResult> {
    const res = await fetch(steamAvatarUrl, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      throw new Error(`Failed to fetch avatar from Steam CDN: ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return this.uploadFile({
      buffer,
      filename: `steam-${steamId}.jpg`,
      contentType,
      folder: "avatars",
    });
  }
}

export const storageService = new StorageService();
