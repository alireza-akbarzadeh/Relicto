"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { removePushSubscription, savePushSubscription } from "../actions/notifications";
import { PUBLIC_KEY, pushSupported, vapidKey } from "../lib/push";

export type PushState = "unsupported" | "blocked" | "off" | "on" | "working";

type Keys = { endpoint: string; keys: { p256dh: string; auth: string } };
const serialize = (subscription: PushSubscription) => subscription.toJSON() as Keys;

/**
 * Device push opt-in. Registers the service worker, asks the browser for
 * permission only when the trader taps the toggle, and keeps the server's
 * record of this device in step with the browser's.
 */
export function usePushSubscription() {
  const [state, setState] = useState<PushState>("unsupported");

  useEffect(() => {
    if (!pushSupported()) return;
    let live = true;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => registration.pushManager.getSubscription())
      .then((existing) => {
        if (!live) return;
        if (Notification.permission === "denied") return setState("blocked");
        setState(existing ? "on" : "off");
        // Re-bind an existing subscription: this browser may have been someone else's session before.
        if (existing) void savePushSubscription(serialize(existing)).catch(() => undefined);
      })
      .catch(() => live && setState("unsupported"));

    return () => {
      live = false;
    };
  }, []);

  const enable = async () => {
    setState("working");
    try {
      if ((await Notification.requestPermission()) !== "granted") return setState("blocked");
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey(PUBLIC_KEY),
      });
      await savePushSubscription(serialize(subscription));
      setState("on");
      toast.success("Trade alerts are on", { description: "This device will hear about your orders and sales." });
    } catch {
      setState("off");
      toast.error("Couldn't turn on trade alerts", { description: "Check this browser's notification settings." });
    }
  };

  const disable = async () => {
    setState("working");
    try {
      const subscription = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
      if (subscription) {
        await removePushSubscription({ endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
      setState("off");
    } catch {
      setState("on");
    }
  };

  return { state, enable, disable };
}
