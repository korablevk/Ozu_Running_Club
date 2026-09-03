"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        "fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3.5 lg:hidden transition-colors duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm"
          : "bg-gradient-to-b from-black/50 to-transparent"
      )}
    >
      <Link href="/" className="flex items-center gap-1.5 focus:outline-none">
        <span
          className={cn(
            "font-extrabold text-lg tracking-tighter font-display transition-colors",
            isOverHero ? "text-white" : "text-asphalt-black"
          )}
        >
          ÖZÜ
        </span>
        <span className="text-volt font-black text-lg">RC</span>
      </Link>

      <Link
        href="/join"
        className={cn(
          "text-[11px] font-mono uppercase font-bold tracking-telemetry px-3 py-1.5 rounded-pill transition-all",
          isOverHero
            ? "bg-volt text-asphalt-black hover:bg-volt-hover"
            : "bg-asphalt-black text-white hover:bg-neutral-800"
        )}
      >
        Join Club
      </Link>
    </div>
  );
}
