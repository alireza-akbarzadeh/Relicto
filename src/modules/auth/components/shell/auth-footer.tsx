import { SoonLink } from "@/modules/relicto/components/shell/soon-link";

const LINKS = ["Security SLA", "Terms of Service", "Privacy Policy"];

export function AuthFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-surface-container-lowest py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="max-w-2xl text-xs leading-relaxed text-text-muted">
            Not affiliated with Valve Corporation. Steam and the Steam logo are trademarks or registered trademarks of Valve
            Corporation in the U.S. and/or other countries. All game graphics and logos belong to their respective owners.
          </p>
          <span className="font-mono text-[11px] text-text-secondary">
            © 2025 Relicto Pro Intel Technologies. Operational Status: Escrow Vault Active.
          </span>
        </div>
        <div className="flex items-center gap-6">
          {LINKS.map((label) => (
            <SoonLink
              key={label}
              label={label}
              className="font-mono text-xs font-medium text-text-secondary uppercase transition-colors hover:text-white"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
