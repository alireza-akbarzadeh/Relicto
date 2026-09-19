import Link from "next/link";
import type { DesktopShell } from "../../../shell.types";
import { BrandMarkSmall } from "./brand-mark";

export function DesktopFooter({ shell }: { shell: DesktopShell }) {
  const { footer } = shell;
  return (
    <footer className="mt-space-xl w-full bg-surface-deep">
      <div className="flex w-full flex-col items-center justify-between gap-space-lg px-margin-desktop py-space-xl md:flex-row">
        <div className="flex flex-col gap-space-xs text-center md:text-left">
          <BrandMarkSmall brand={shell.brand} />
          <p className="max-w-md font-body-sm text-body-sm text-text-muted">{footer.description}</p>
        </div>
        <nav className="flex items-center gap-space-lg font-label-caps text-label-caps text-text-muted uppercase">
          {footer.links.map((link) => (
            <Link key={link.id} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-center font-data-mono-md text-label-badge text-text-muted md:text-right">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
