"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClubLogo } from "@/components/ui/ClubLogo";
import { cn } from "@/lib/utils";

export function MobileTopBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isOverHero = isHome && !isScrolled;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3 lg:hidden transition-colors duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm"
          : "bg-gradient-to-b from-club-deepNavy/80 via-club-deepNavy/30 to-transparent"
      )}
    >
      <ClubLogo size="sm" variant={isOverHero ? "light" : "dark"} />

      <Link
        href="/join"
        className="text-[11px] font-mono uppercase font-bold tracking-telemetry px-3.5 py-1.5 rounded-pill transition-all bg-club-crimson text-white hover:bg-club-burgundy shadow-sm active:scale-95"
      >
        Join Club
      </Link>
    </div>
  );
}
