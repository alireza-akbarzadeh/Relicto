import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom `text-*` font-size roles from the design system. Registered so
 * tailwind-merge doesn't mistake `text-label-caps` for a text color and drop it
 * when merged next to `text-text-primary`.
 */
const FONT_SIZE_ROLES = [
  "body-sm",
  "body-md",
  "body-lg",
  "label-badge",
  "label-caps",
  "data-mono-md",
  "data-mono-lg",
  "headline-sm",
  "headline-md",
  "headline-lg",
  "headline-lg-mobile",
  "headline-xl",
  "headline-xl-mobile",
  "display-hero",
  "display-hero-mobile",
];

const twMerge = extendTailwindMerge({
  extend: { theme: { text: FONT_SIZE_ROLES } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
