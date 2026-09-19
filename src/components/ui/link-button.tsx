import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./button";

type LinkButtonProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

/**
 * A Next.js link that looks like a shadcn Button. Variant and size default to
 * none, so Stitch designs can style it fully through `className`.
 */
export function LinkButton({ className, variant = null, size = null, ...props }: LinkButtonProps) {
  return <Link data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
