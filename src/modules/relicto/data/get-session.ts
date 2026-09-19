import "server-only";

import { notifications, sessionUser } from "./session.mock";

/** The signed-in trader. Mock today; will read the Better Auth session. */
export async function getSession() {
  return { user: sessionUser, notifications };
}
