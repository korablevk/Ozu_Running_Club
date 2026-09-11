import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "burgundy"
    | "navy"
    | "deepNavy"
    | "plum"
    | "crimson"
    | "subtle"
    | "dark"
    | "outline"
    | "outline-burgundy"
    | "volt"
    | "danger";
  size?: "default" | "sm";
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "subtle",
  size = "default",
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 font-mono uppercase font-semibold tracking-telemetry select-none rounded-sm";

  const variantStyles = {
    burgundy: "bg-club-burgundy text-white",
    navy: "bg-club-navy text-white",
    deepNavy: "bg-club-deepNavy text-white",
    plum: "bg-club-plum text-white",
    crimson: "bg-club-crimson text-white",
    volt: "bg-club-burgundy text-white", // Default badges to rich burgundy, not volt/red
    subtle: "bg-neutral-100 text-ink border border-neutral-200",
    dark: "bg-ink text-white",
    outline: "bg-transparent border border-neutral-300 text-neutral-700",
    "outline-burgundy": "bg-transparent border border-club-burgundy/40 text-club-burgundy",
    danger: "bg-red-50 text-club-crimson border border-red-200",
  };

  const sizeStyles = {
    default: "text-[11px] px-2.5 py-1",
    sm: "text-[9px] px-2 py-0.5",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
      {children}
    </span>
  );
}
