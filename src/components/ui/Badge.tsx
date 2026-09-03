import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "volt" | "navy" | "subtle" | "dark" | "outline" | "danger";
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
    volt: "bg-volt text-asphalt-black",
    navy: "bg-ozu-navy text-white",
    subtle: "bg-neutral-100 text-neutral-800 border border-neutral-200",
    dark: "bg-asphalt-black text-white",
    outline: "bg-transparent border border-neutral-300 text-neutral-700",
    danger: "bg-red-50 text-red-700 border border-red-200",
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
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-asphalt-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-asphalt-black"></span>
        </span>
      )}
      {children}
    </span>
  );
}
