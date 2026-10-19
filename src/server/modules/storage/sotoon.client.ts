import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

/**
 * Sotoon Object Storage S3 Client configuration.
 * Official docs: https://docs.sotoon.ir/products/object-storage/
 * Endpoints:
 * - Neda DC: https://s3.thr1.sotoon.ir
 * - Afra DC: https://s3.thr2.sotoon.ir
 */
export const SOTOON_CONFIG = {
  endpoint: process.env.SOTOON_ENDPOINT || "https://s3.thr1.sotoon.ir",
  region: process.env.SOTOON_REGION || "thr1",
  bucket: process.env.SOTOON_BUCKET || "relicto",
  accessKey: process.env.SOTOON_ACCESS_KEY,
  secretKey: process.env.SOTOON_SECRET_KEY,
};

export function isSotoonConfigured(): boolean {
  return Boolean(SOTOON_CONFIG.accessKey && SOTOON_CONFIG.secretKey);
}

let cachedClient: S3Client | null = null;

export function getSotoonS3Client(): S3Client | null {
  if (!isSotoonConfigured()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new S3Client({
      endpoint: SOTOON_CONFIG.endpoint,
      region: SOTOON_CONFIG.region,
      credentials: {
        accessKeyId: SOTOON_CONFIG.accessKey!,
        secretAccessKey: SOTOON_CONFIG.secretKey!,
      },
      forcePathStyle: true, // Sotoon S3 uses path-style bucket naming (s3.thr1.sotoon.ir/bucket/key)
    });
  }

  return cachedClient;
}

/** Constructs the public URL for an object stored in Sotoon. */
export function getSotoonPublicUrl(key: string): string {
  const cleanEndpoint = SOTOON_CONFIG.endpoint.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${cleanEndpoint}/${SOTOON_CONFIG.bucket}/${cleanKey}`;
}
