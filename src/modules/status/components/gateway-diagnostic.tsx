import { OUTAGE } from "../data/status.mock";

export function GatewayDiagnostic() {
  return (
    <div className="relative lg:col-span-5">
      <div className="relative flex w-full flex-col gap-space-md overflow-hidden rounded-xl bg-surface-card p-space-md shadow-2xl">
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="h-3 w-3 rounded-full bg-primary-container" />
            <span className="h-3 w-3 rounded-full bg-tertiary" />
            <span className="h-3 w-3 rounded-full bg-surface-container-highest" />
          </div>
          <span className="font-label-badge text-label-badge text-text-muted">
            DIAGNOSTIC_CORE // HARNESS_V4
          </span>
        </div>
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest">
          <div
            className="h-full w-full bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url('${OUTAGE.diagnosticImage}')` }}
          />
          <div className="absolute inset-0 bg-linear-to-t/srgb from-surface-card via-transparent to-surface-card/60" />
          <div className="absolute inset-0 flex flex-col justify-between p-space-md">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-badge text-label-badge font-bold text-primary">{OUTAGE.route}</span>
                <span className="font-data-mono-md text-data-mono-md text-text-muted">ERR_CONNECTION_TIMED_OUT</span>
              </div>
              <div className="rounded bg-surface-overlay px-space-sm py-space-xs font-data-mono-md text-data-mono-md text-error shadow-md">
                503 UNAVAILABLE
              </div>
            </div>
            <svg className="h-20 w-full overflow-visible text-primary" fill="none" viewBox="0 0 300 70">
              <path
                className="opacity-90"
                d="M 0 35 L 45 35 L 60 15 L 75 55 L 90 35 L 125 35 L 135 5 L 145 65 L 155 35 L 180 35"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <circle className="animate-ping" cx="180" cy="35" fill="currentColor" r="4" />
              <line className="opacity-40" stroke="currentColor" strokeDasharray="4 4" strokeWidth="2" x1="184" x2="204" y1="35" y2="35" />
              <path d="M 210 35 L 240 35 L 255 35 L 300 35" stroke="#64748b" strokeDasharray="2 6" strokeLinecap="round" strokeWidth="2" />
              <text fill="#ffb2b7" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" x="210" y="24">
                SEVERED LINK
              </text>
              <text fill="#ffb95f" fontFamily="JetBrains Mono" fontSize="9" x="25" y="62">
                HEARTBEAT DROP: 99.4%
              </text>
            </svg>
            <div className="flex items-center justify-between font-label-badge text-label-badge text-text-muted">
              <span>TX: 0.00 KB/S</span>
              <span>RX: 0.00 KB/S</span>
              <span className="text-primary">DESYNC DETECTED</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-space-sm text-center">
          <div className="flex flex-col rounded bg-surface-container-low p-space-sm">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">Valve Response Time</span>
            <span className="font-data-mono-lg text-data-mono-lg text-tertiary">2,480 ms</span>
          </div>
          <div className="flex flex-col rounded bg-surface-container-low p-space-sm">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">Escrow Intercept Status</span>
            <span className="font-data-mono-lg text-data-mono-lg text-text-primary">100% Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
