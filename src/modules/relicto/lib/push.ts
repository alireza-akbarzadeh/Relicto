/** VAPID public key as the byte array `pushManager.subscribe` expects. */
export function vapidKey(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(window.atob(padded), (char) => char.charCodeAt(0));
}

export const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/** Push needs a service worker, the Push API and a configured server key. */
export const pushSupported = () =>
  Boolean(PUBLIC_KEY) && typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
