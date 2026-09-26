/**
 * Relicto service worker. Shows trade notifications pushed by the server
 * (payload: `PushPayload` in notifications.push.ts) and opens the order when
 * one is tapped. Open tabs are told to refresh their bell.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const { title = "Relicto", body = "", href = "/orders", tag, action, sticky = false } = data;

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, {
        body,
        tag,
        renotify: Boolean(tag),
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-96.png",
        // A trade waiting on this person stays up until they deal with it, with a button naming the step.
        requireInteraction: sticky,
        actions: action ? [{ action: "open", title: action }] : [],
        vibrate: sticky ? [120, 60, 120] : [80],
        data: { href },
      });
      const tabs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const tab of tabs) tab.postMessage({ type: "notifications:refresh" });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.href ?? "/orders", self.location.origin).href;

  event.waitUntil(
    (async () => {
      const tabs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const tab = tabs.find((client) => new URL(client.url).origin === self.location.origin);
      if (!tab) return self.clients.openWindow(url);
      await tab.focus();
      return tab.navigate(url);
    })(),
  );
});
