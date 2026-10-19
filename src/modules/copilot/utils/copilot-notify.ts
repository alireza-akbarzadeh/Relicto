/**
 * Sentinel Push Notification Dispatcher
 * Integrates Web Notifications API with permission management and fallback.
 */

export type PushPermissionStatus = "granted" | "denied" | "default" | "unsupported";

export function getPushPermissionStatus(): PushPermissionStatus {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function requestPushPermission(): Promise<PushPermissionStatus> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn("[SentinelPush] Permission request error:", err);
    return "denied";
  }
}

interface PushOptions {
  title?: string;
  body: string;
  onClick?: () => void;
}

export function sendPushNotification({
  title = "Sentinel AI Trader Copilot",
  body,
  onClick,
}: PushOptions): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  try {
    const cleanSnippet = body
      .replace(/[*#`_~]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 160)
      .trim();

    const notif = new Notification(title, {
      body: cleanSnippet,
      icon: "/favicon.ico",
      tag: "sentinel-copilot-reply",
    });

    notif.onclick = () => {
      window.focus();
      window.dispatchEvent(new CustomEvent("relicto:open-copilot"));
      onClick?.();
      notif.close();
    };

    return true;
  } catch (err) {
    console.warn("[SentinelPush] Notification dispatch error:", err);
    return false;
  }
}
