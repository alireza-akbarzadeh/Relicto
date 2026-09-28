import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site";

const ASSURANCES: { icon: IconName; label: string }[] = [
  { icon: "shield_lock", label: "Escrow-protected trades" },
  { icon: "verified_user", label: "Sign in with Steam" },
];

/** Wordmark, what Relicto is, and the two guarantees every trade carries. */
export function FooterBrand({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link href="/" className="group inline-flex items-center gap-space-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)]">
          <Icon name="swords" className="text-[20px] text-on-primary-container" />
        </span>
        <span className="flex flex-col">
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary">
            Relicto
          </span>
          <span className="font-label-badge text-label-badge tracking-wider text-tertiary uppercase">{SITE_TAGLINE}</span>
        </span>
      </Link>
      <p className="mt-space-md max-w-sm font-body-sm text-[13px] leading-relaxed text-text-secondary">{SITE_DESCRIPTION}</p>
      <ul className="mt-space-md flex flex-wrap gap-2">
        {ASSURANCES.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2.5 py-1.5 font-label-badge text-[11px] text-text-secondary"
          >
            <Icon name={item.icon} className="text-[15px] text-tertiary" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
