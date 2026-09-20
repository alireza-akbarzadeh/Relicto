"use client";

import { useEffect } from "react";
import { GatewayErrorView } from "@/modules/status/components/gateway-error-view";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Replaces the default Next.js error UI for the signed-in app shell. */
export default function LootoraError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <GatewayErrorView onRetry={reset} />;
}
