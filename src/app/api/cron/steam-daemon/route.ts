import { NextRequest, NextResponse } from "next/server";
import { steamDaemonService } from "@/server/modules/steam-daemon/steam-daemon.service";
import { bearerMatches } from "@/server/modules/shared/bearer";

/**
 * Steam Sentinel Bot Daemon Cron Trigger.
 * Periodically polls for escrow orders requiring trade offer dispatch and executes
 * the automated bot offer dispatch queue.
 */
export async function GET(request: NextRequest) {
  if (!bearerMatches(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const summary = await steamDaemonService.runDaemonCycle();
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[api/cron/steam-daemon] execution error:", error);
    return NextResponse.json({ error: "daemon_cycle_failed" }, { status: 500 });
  }
}
