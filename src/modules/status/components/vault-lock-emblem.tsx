import { Icon } from "@/components/ui/icon";

/** Shield lock centerpiece from the Stitch 403 forbidden screen. */
export function VaultLockEmblem() {
  return (
    <div className="relative flex h-56 w-56 items-center justify-center md:h-72 md:w-72">
      <svg className="absolute inset-0 h-full w-full animate-[spin_24s_linear_infinite]" fill="none" viewBox="0 0 288 288">
        <circle className="text-border-focus" cx="144" cy="144" r="138" stroke="currentColor" strokeDasharray="12 18" strokeLinecap="round" strokeWidth="1.5" />
        <circle className="text-outline-variant" cx="144" cy="144" r="118" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1" />
        <path className="text-primary" d="M144 6 A138 138 0 0 1 282 144" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
      <div className="absolute inset-4 flex items-center justify-center rounded-full bg-surface-card/90 shadow-[0_0_40px_rgba(244,63,94,0.3)] backdrop-blur-xl">
        <svg className="h-28 w-28 text-primary md:h-36 md:w-36" fill="none" viewBox="0 0 120 120">
          <path d="M60 10 L102 26 V62 C102 88 60 108 60 108 C60 108 18 88 18 62 V26 L60 10 Z" fill="#191b23" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.5" />
          <path d="M48 52 V38 C48 31.3726 53.3726 26 60 26 C66.6274 26 72 31.3726 72 38 V52" stroke="#ffb95f" strokeLinecap="round" strokeWidth="3" />
          <rect fill="#ff516a" height="28" rx="3" width="36" x="42" y="52" />
          <circle cx="60" cy="63" fill="#ffffff" r="3.5" />
          <path d="M60 66.5 V73" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
          <circle cx="36" cy="46" fill="#ffb95f" r="4" />
          <line stroke="#ffb95f" strokeDasharray="2 2" strokeWidth="1.5" x1="36" x2="48" y1="46" y2="56" />
          <circle cx="84" cy="46" fill="#06b6d4" r="4" />
          <line stroke="#06b6d4" strokeDasharray="2 2" strokeWidth="1.5" x1="84" x2="72" y1="46" y2="56" />
        </svg>
      </div>
      <div className="absolute bottom-2 flex items-center gap-space-xs rounded-full bg-surface-container-highest/90 px-space-sm py-1 shadow-md backdrop-blur-md">
        <Icon name="lock_clock" className="text-body-sm text-tertiary" filled />
        <span className="font-data-mono-md text-label-badge font-bold tracking-wider text-tertiary uppercase">ESCROW HOLD ACTIVE</span>
      </div>
    </div>
  );
}
