import { getUserId } from "@/modules/relicto/data/get-session";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/**
 * The bell's feed, for the client to refresh without a page load — polled
 * while the tab is visible and fetched at once when a push arrives.
 */
export async function GET() {
  const userId = await getUserId();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  return Response.json(
    { notifications: await notificationService.feed(userId) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
