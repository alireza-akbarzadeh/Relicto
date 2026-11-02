"use client";

import {useCallback, useEffect} from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error digest, avoiding full stack traces in client console
    console.error("[GlobalError]", error.digest || "An unexpected error occurred");
  }, [error]);


  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0e1015] text-[#e1e2ec] font-sans antialiased">
        <div className="max-w-md rounded-xl border border-white/10 bg-[#161922] p-8 text-center shadow-2xl">
          <h2 className="text-xl font-bold text-rose-400 mb-2">Application Error</h2>
          <p className="text-sm text-neutral-400 mb-6">
            A critical error occurred while rendering the page. Our systems have logged this event.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

