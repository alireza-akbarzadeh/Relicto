"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { formatCount, formatMoney, toPersianDigits } from "@/lib/format";
import { useSession, useViewer } from "../../state/session-provider";

type MobileWalletProps = { variant: "market" | "linked" | "intel" };

/** Session wallet balance, drawn the way each mobile header family shows it. Opens the wallet. */
export function MobileWallet({ variant }: MobileWalletProps) {
  return useViewer() ? <SignedInMobileWallet variant={variant} /> : null;
}

function SignedInMobileWallet({ variant }: MobileWalletProps) {
  const { user } = useSession();
  const locale = useLocale();
  const t = useTranslations("shell");
  const balance = formatMoney(user.walletUsd, { locale });

  if (variant === "linked") {
    const [whole, cents] = user.walletUsd.toFixed(2).split(".");
    const wholeFormatted =
      locale === "fa"
        ? toPersianDigits(formatCount(Number(whole)))
        : formatCount(Number(whole));
    const centsFormatted = locale === "fa" ? toPersianDigits(cents ?? "00") : cents;
    return (
      <Link
        href="/wallet"
        aria-label={t("walletIncome")}
        className="flex h-9 items-center gap-1.5 rounded-xl bg-surface-container-low px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <span className="font-label-caps text-label-caps text-tertiary">$</span>
        <span className="font-data-mono-md text-data-mono-md text-text-primary">
          {wholeFormatted}.{centsFormatted}
        </span>
      </Link>
    );
  }

  if (variant === "intel") {
    return (
      <Link href="/wallet" className="flex flex-col items-end rounded bg-surface-container-lowest px-2.5 py-1">
        <span className="font-label-badge text-label-badge text-text-muted uppercase">{t("escrowBal")}</span>
        <span className="font-data-mono-md text-data-mono-md font-bold tracking-tight text-tertiary">{balance}</span>
      </Link>
    );
  }

  return (
    <Link href="/wallet" className="flex items-center gap-1 rounded-lg bg-surface-card/90 px-2.5 py-1">
      <Icon name="account_balance_wallet" className="text-[14px] text-tertiary" />
      <span className="font-data-mono-md text-data-mono-md font-bold tracking-tight text-tertiary">{balance}</span>
    </Link>
  );
}
