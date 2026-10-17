import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { steamDaemonService } from "../src/server/modules/steam-daemon/steam-daemon.service";

async function main() {
  const isLoop = process.argv.includes("--loop");
  console.log(`[SteamDaemon] Starting Steam Sentinel Bot Daemon (mode: ${isLoop ? "continuous" : "single-pass"})...`);

  async function step() {
    try {
      const summary = await steamDaemonService.runDaemonCycle();
      if (summary.dispatchedCount > 0) {
        console.log(`[SteamDaemon] Cycle complete: Dispatched ${summary.dispatchedCount} offers (${summary.dispatchedOrders.join(", ")})`);
      }
    } catch (err) {
      console.error("[SteamDaemon] Error during daemon cycle:", err);
    }
  }

  await step();

  if (isLoop) {
    setInterval(step, 5000);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("[SteamDaemon] Fatal error:", err);
  process.exit(1);
});
