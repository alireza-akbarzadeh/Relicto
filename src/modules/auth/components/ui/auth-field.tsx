"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

type AuthFieldProps = Omit<ComponentProps<typeof Input>, "className"> & {
  id: string;
  label: string;
  /** Right side of the label row (hint, status, link). */
  aside?: ReactNode;
  icon?: IconName;
  iconPosition?: "left" | "right";
  iconClassName?: string;
  /** Adds a show/hide toggle for password fields. */
  revealable?: boolean;
  labelClassName?: string;
  inputClassName?: string;
};

/** Label row + shadcn Input with an optional icon and password reveal, in the auth card style. */
export function AuthField({
  id,
  label,
  aside,
  icon,
  iconPosition = "left",
  iconClassName,
  revealable,
  type = "text",
  labelClassName,
  inputClassName,
  ...input
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const inputType = revealable ? (revealed ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={cn("gap-1 leading-[inherit]", labelClassName)}>
          {label}
        </Label>
        {aside}
      </div>
      <div className="relative flex items-center">
        {icon && iconPosition === "left" && (
          <Icon name={icon} className={cn("absolute left-3.5 text-[18px] text-text-muted", iconClassName)} />
        )}
        <Input id={id} type={inputType} className={cn("h-auto", inputClassName)} {...input} />
        {icon && iconPosition === "right" && !revealable && (
          <Icon name={icon} className={cn("absolute right-3 text-[18px] text-text-muted", iconClassName)} />
        )}
        {revealable && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={revealed ? "Hide password" : "Show password"}
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-2 text-text-muted hover:bg-transparent hover:text-[#cbd5e1]"
          >
            <Icon name={revealed ? "visibility_off" : "visibility"} className="text-[18px]" />
          </Button>
        )}
      </div>
    </div>
  );
}
