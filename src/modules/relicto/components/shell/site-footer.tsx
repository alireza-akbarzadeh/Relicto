import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { FOOTER_COLUMNS, type FooterColumn } from "../../data/footer-links";
import { FooterBottomBar } from "./footer-bottom-bar";
import { FooterBrand } from "./footer-brand";

/**
 * The one footer every page shares. Real links only: each column entry is a
 * live route, so it doubles as a crawlable site directory.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full border-t border-outline-variant/20 bg-surface-deep", className)}>
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-x-space-lg gap-y-space-xl px-4 py-space-xl md:grid-cols-3 md:px-margin-desktop lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <FooterBrand className="col-span-2 md:col-span-3 lg:col-span-1" />
        {FOOTER_COLUMNS.map((column) => (
          <FooterLinks key={column.title} column={column} />
        ))}
      </div>
      <FooterBottomBar />
    </footer>
  );
}

function FooterLinks({ column }: { column: FooterColumn }) {
  return (
    <nav aria-label={column.title} className="flex flex-col gap-space-sm">
      <span className="mb-1 flex items-center gap-2">
        <Icon name={column.icon} className={cn("text-[17px]", column.tone)} />
        <span className="font-headline-sm text-[13px] tracking-wider text-text-primary uppercase">{column.title}</span>
      </span>
      <ul className="flex flex-col gap-2.5">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-body-sm text-[13px] text-text-secondary transition-colors hover:text-text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
