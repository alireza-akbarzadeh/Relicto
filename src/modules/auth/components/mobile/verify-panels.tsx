import Image from "next/image";
import Link from "next/link";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import type { VerifyMobile } from "../../data/verify-mobile.mock";

const SMALL = "flex-1 rounded bg-surface-container-high px-space-xs py-1.5 text-center font-label-badge text-label-badge font-semibold tracking-wider uppercase transition hover:bg-surface-bright";

/** Direct app approval status and the vault item waiting on this challenge. */
export function ApprovalPanels({ data }: { data: VerifyMobile }) {
  return (
    <>
      <div className="mt-space-md px-space-md">
        <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface-card p-space-md shadow-lg">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-secondary-container/20 blur-xl" />
          <div className="relative z-10 flex items-start gap-space-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container/30 text-secondary">
              <Icon name="notifications_active" className="text-[20px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center justify-between">
                <span className="font-label-badge text-label-badge font-semibold tracking-wider text-secondary uppercase">DIRECT APP APPROVAL</span>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-upcoming" />
                  <span className="font-data-mono-md text-data-mono-md text-text-secondary">POLLING</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm font-medium text-text-primary">{data.device}</p>
              <p className="mt-0.5 font-body-sm text-body-sm text-text-muted">
                Open Steam Mobile and tap <span className="font-medium text-secondary">&quot;Approve Trade Session&quot;</span>
              </p>
              <div className="mt-space-sm flex items-center justify-between rounded-lg bg-surface-container-lowest/50 px-space-sm pt-space-sm pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
                  <span className="font-data-mono-md text-data-mono-md text-text-secondary">Awaiting signature handshake...</span>
                </div>
                <NoticeButton
                  notice={{ title: "Polling Steam", description: "Checking the approval status again." }}
                  className="h-auto border-0 font-label-badge text-label-badge font-semibold tracking-wider text-secondary uppercase hover:text-text-primary"
                >
                  Refresh
                </NoticeButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-space-md px-space-md">
        <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-container-low p-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-surface-container">
              <Image src={data.vaultItem.image} alt={data.vaultItem.imageAlt} width={80} height={80} sizes="40px" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="block font-data-mono-md text-data-mono-md leading-tight font-semibold text-text-primary">{data.vaultItem.name}</span>
              <span className="font-data-mono-md text-data-mono-md text-tertiary">{data.vaultItem.value}</span>
            </div>
          </div>
          <div className="rounded border border-white/5 bg-surface-container px-2 py-1 text-right">
            <span className="block font-label-badge text-label-badge text-text-secondary uppercase">TARGET VAULT</span>
            <span className="font-data-mono-md text-data-mono-md font-bold text-text-primary">{data.vaultItem.vault}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/** Recovery options and the anti-phishing rule under the confirm button. */
export function RecoveryPanels({ domain }: { domain: string }) {
  return (
    <>
      <div className="mt-space-md px-space-md">
        <div className="flex flex-col gap-space-xs rounded-xl border border-border-subtle bg-surface-container p-space-sm">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Icon name="help" className="text-[16px] text-tertiary" />
            <span className="font-headline-sm text-headline-sm font-semibold text-text-primary">Lost access to Steam Authenticator?</span>
          </div>
          <p className="font-body-sm text-body-sm text-text-muted">
            You can authorize with your Valve Emergency Recovery Token (R-code) or connect directly with our on-chain automated arbitration protocol.
          </p>
          <div className="mt-1 flex items-center gap-space-sm">
            <Link href="/reset-password" className={`${SMALL} text-text-primary`}>
              Use Valve R-Token
            </Link>
            <NoticeButton notice={{ title: "Arbiter paged", description: "A 24/7 escrow arbiter will reply in this session." }} className={`${SMALL} h-auto border-0 text-primary`}>
              Contact 24/7 Arbiter
            </NoticeButton>
          </div>
        </div>
      </div>

      <div className="mt-space-md px-space-md">
        <div className="flex items-start gap-space-sm rounded-lg border border-border-subtle bg-surface-container-lowest p-space-sm">
          <Icon name="verified_user" className="mt-0.5 shrink-0 text-[18px] text-tertiary" />
          <div className="flex-1">
            <p className="font-body-sm text-body-sm leading-relaxed text-text-muted">
              <strong className="font-semibold text-text-secondary">Official Security Rule:</strong> Relicto personnel will{" "}
              <span className="text-primary underline">never</span> ask for your Steam password, mobile auth tokens, or private recovery codes.
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="flex items-center gap-1 font-data-mono-md text-data-mono-md text-status-upcoming">
                <Icon name="lock" className="text-[11px]" /> {domain}
              </span>
              <span className="font-data-mono-md text-data-mono-md text-text-muted">Cert SHA-256 Validated</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
