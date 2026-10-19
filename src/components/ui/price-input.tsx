"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PriceInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number | null;
  onChange: (value: number) => void;
  currencyPrefix?: string;
  currencySuffix?: string;
  allowDecimals?: boolean;
  min?: number;
  max?: number;
}

export function PriceInput({
  value,
  onChange,
  currencyPrefix = "$",
  currencySuffix = "USD",
  allowDecimals = true,
  min = 0,
  max,
  className,
  placeholder = "0.00",
  disabled,
  ...props
}: PriceInputProps) {
  // Format numeric value to string with commas
  const formatValue = React.useCallback(
    (val?: number | null) => {
      if (val == null || isNaN(val)) return "";
      if (val === 0 && !allowDecimals) return "0";
      return val.toLocaleString("en-US", {
        maximumFractionDigits: allowDecimals ? 2 : 0,
        minimumFractionDigits: 0,
      });
    },
    [allowDecimals]
  );

  const [displayValue, setDisplayValue] = React.useState<string>(() => formatValue(value));
  const [isFocused, setIsFocused] = React.useState(false);

  // Sync internal display when external value changes and not actively typing
  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatValue(value));
    }
  }, [value, isFocused, formatValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Filter characters: allow digits, one decimal point, and ignore commas
    let cleaned = raw.replace(/[^\d.]/g, "");

    if (!allowDecimals) {
      cleaned = cleaned.replace(/\./g, "");
    } else {
      // Allow only the first dot
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
      }
      // Limit to 2 decimal places
      if (parts.length === 2 && parts[1].length > 2) {
        cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }

    if (!cleaned) {
      setDisplayValue("");
      onChange(0);
      return;
    }

    setDisplayValue(cleaned);

    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      let constrained = Math.max(min, parsed);
      if (max !== undefined) constrained = Math.min(max, constrained);
      onChange(constrained);
    } else {
      onChange(0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(value ? formatValue(value) : "");
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value ? value.toString() : "");
  };

  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg border border-border-subtle bg-surface-container transition-all",
        "focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-primary/20",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {currencyPrefix && (
        <span className="flex items-center pl-2.5 pr-1 font-mono text-xs font-semibold text-text-muted select-none">
          {currencyPrefix}
        </span>
      )}

      <input
        type="text"
        inputMode={allowDecimals ? "decimal" : "numeric"}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full bg-transparent px-1.5 py-1 text-xs font-mono font-medium text-text-primary placeholder:text-text-muted/50 focus:outline-none",
          !currencyPrefix && "pl-2.5",
          !currencySuffix && "pr-2.5"
        )}
        {...props}
      />

      {currencySuffix && (
        <span className="flex items-center pr-2.5 pl-1 font-mono text-[10px] uppercase font-bold text-text-muted select-none">
          {currencySuffix}
        </span>
      )}
    </div>
  );
}
