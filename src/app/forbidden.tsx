import { ForbiddenView } from "@/modules/status/components/forbidden-view";

/** Rendered when server code calls `forbidden()` from `next/navigation`. */
export default function Forbidden() {
  return <ForbiddenView />;
}
