"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClubLogoProps {
  size?: "sm" | "default" | "lg";
  variant?: "dark" | "light" | "auto";
  showText?: boolean;
  showSubtitle?: boolean;
  href?: string;
  className?: string;
}

export function ClubLogo({
  size = "default",
  variant = "auto",
  showText = true,
  showSubtitle = true,
  href = "/",
  className,
}: ClubLogoProps) {
  const sizeMap = {
    sm: {
      badge: "w-7 h-7 sm:w-8 sm:h-8",
      badgePx: 32,
      title: "text-base tracking-tighter",
      subtitle: "text-[9px] tracking-telemetry",
    },
    default: {
      badge: "w-9 h-9 sm:w-10 sm:h-10",
      badgePx: 40,
      title: "text-lg sm:text-xl tracking-tighter",
      subtitle: "text-[10px] sm:text-[11px] tracking-telemetry",
    },
    lg: {
      badge: "w-12 h-12 sm:w-14 sm:h-14",
      badgePx: 56,
      title: "text-2xl tracking-tighter",
      subtitle: "text-xs tracking-telemetry",
    },
  };

  const selectedSize = sizeMap[size];

  const content = (
    <div className={cn("group flex items-center gap-2.5 select-none", className)}>
      {/* Circular Emblem with CSS mask to eliminate white JPEG corners */}
      <div
        className={cn(
          "relative rounded-full overflow-hidden shrink-0 shadow-sm border border-white/20 transition-transform duration-300 group-hover:scale-105",
          selectedSize.badge
        )}
      >
        <Image
          src="/logo.jpeg"
          alt="ÖzÜ Running Club Emblem"
          width={selectedSize.badgePx}
          height={selectedSize.badgePx}
          className="w-full h-full object-cover scale-[1.04]"
          priority
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center font-display font-extrabold">
            <span
              className={cn(
                "transition-colors duration-200",
                selectedSize.title,
                variant === "light"
                  ? "text-white"
                  : variant === "dark"
                  ? "text-ink"
                  : "text-inherit"
              )}
            >
              ÖZÜ
            </span>
            <span className={cn("ml-1 font-black text-club-burgundy", selectedSize.title)}>
              RC
            </span>
          </div>

          {showSubtitle && (
            <span
              className={cn(
                "font-mono uppercase font-semibold transition-colors mt-0.5",
                selectedSize.subtitle,
                variant === "light"
                  ? "text-neutral-300"
                  : variant === "dark"
                  ? "text-neutral-500"
                  : "text-current opacity-70"
              )}
            >
              Running Club
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-club-burgundy rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
