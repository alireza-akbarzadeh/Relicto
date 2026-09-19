import { House } from "lucide-react";
import Link from "next/link";

export function HubBreadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px]">
      <Link href="/" className="flex items-center gap-1 text-text-muted transition-colors hover:text-white">
        <House className="size-3.5" /> PORTAL
      </Link>
      <span className="text-text-muted">/</span>
      <Link href="/" className="text-text-muted transition-colors hover:text-white">
        GAME HUB
      </Link>
      <span className="text-text-muted">/</span>
      <span aria-current="page" className="font-bold tracking-wider text-primary uppercase">
        META INTEL &amp; TOURNAMENT VAULT
      </span>
    </nav>
  );
}
