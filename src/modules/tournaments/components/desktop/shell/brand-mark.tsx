import { Icon } from "@/components/ui/icon";
import type { Brand } from "../../../types";

/** Shield logo with the two-tone wordmark and tagline. */
export function BrandMark({ brand }: { brand: Brand }) {
  return (
    <div className="flex items-center gap-space-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded bg-primary-container shadow-[0_0_16px_rgba(244,63,94,0.35)]">
        <Icon name="shield" className="font-headline-sm text-headline-sm text-on-primary" />
      </div>
      <div className="flex flex-col">
        <span className="font-headline-sm text-headline-sm leading-none tracking-wider text-text-primary uppercase">
          {brand.name}
          <span className="text-primary-container">{brand.accent}</span>
        </span>
        {brand.tagline && (
          <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">
            {brand.tagline}
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact footer variant of the logo. */
export function BrandMarkSmall({ brand }: { brand: Brand }) {
  return (
    <div className="flex items-center justify-center gap-space-sm md:justify-start">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-container">
        <Icon name="shield" className="font-headline-sm text-body-md text-on-primary" />
      </div>
      <span className="font-headline-sm text-headline-sm tracking-wider text-text-primary uppercase">
        {brand.name} {brand.accent}
      </span>
    </div>
  );
}
