import { Icon } from "@/components/ui/icon";

/** Hex desync radar from the Stitch 404 / item-not-found art. */
export function DesyncEmblem() {
  return (
    <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
      <div className="absolute inset-0 animate-pulse rounded-full bg-primary-container/10 blur-2xl" />
      <svg className="h-full w-full drop-shadow-[0_0_25px_rgba(244,63,94,0.35)]" fill="none" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
        <circle className="text-surface-bright opacity-30" cx="160" cy="160" r="140" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1.5" />
        <circle className="text-primary-container opacity-40" cx="160" cy="160" r="115" stroke="currentColor" strokeDasharray="12 12" strokeWidth="1" />
        <line className="text-surface-container-highest opacity-40" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="160" x2="160" y1="10" y2="310" />
        <line className="text-surface-container-highest opacity-40" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="10" x2="310" y1="160" y2="160" />
        <g transform="translate(160, 160) scale(0.92)">
          <polygon fill="#151b2b" fillOpacity="0.85" points="0,-75 65,-37 65,37 0,75 -65,37 -65,-37" />
          <polygon fill="#1d1f27" fillOpacity="0.9" points="0,-75 65,-37 0,0 -65,-37" />
          <polygon fill="#10131a" fillOpacity="0.95" points="-65,-37 0,0 0,75 -65,37" />
          <polygon fill="#191b23" fillOpacity="0.9" points="0,0 65,-37 65,37 0,75" />
          <path className="animate-pulse" d="M-15,-20 L25,-10 L-10,15 L30,25" stroke="#ff516a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          <circle cx="25" cy="-10" fill="#ffdadb" r="3" />
          <circle cx="-10" cy="15" fill="#ffdadb" r="3" />
          <path d="M-55,-15 L-30,-2 L-40,20" opacity="0.8" stroke="#ffb95f" strokeDasharray="2 3" strokeWidth="1.5" />
          <path d="M35,-20 L50,0 L35,28" opacity="0.8" stroke="#c0c1ff" strokeDasharray="3 2" strokeWidth="1.5" />
          <polygon fill="#ff516a" fillOpacity="0.18" points="-5,-45 45,-15 45,5 -5,-25" />
          <polygon fill="#ca8100" fillOpacity="0.18" points="-45,-15 5,-45 5,-25 -45,5" />
        </g>
        <rect fill="#ff516a" fillOpacity="0.6" height="12" width="12" x="22" y="22" />
        <rect fill="#ff516a" fillOpacity="0.6" height="12" width="12" x="286" y="286" />
        <text fill="#ffdadb" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1" x="38" y="32">
          DE_SYNC_CORRUPT
        </text>
        <text fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1" x="180" y="296">
          CRC://0xFA8019C
        </text>
      </svg>
      <div className="absolute -bottom-3 flex items-center gap-2 rounded-lg bg-surface-overlay px-space-md py-space-xs shadow-lg backdrop-blur-md">
        <Icon name="warning" className="text-base text-primary" />
        <span className="font-data-mono-md text-label-badge tracking-wider text-primary-fixed uppercase">CORRUPTED_CACHE_SEED</span>
      </div>
    </div>
  );
}
