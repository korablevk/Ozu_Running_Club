"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClubLogo } from "@/components/ui/ClubLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { CLUB_LINKS } from "@/lib/data";

export function DesktopHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Runs & Events", href: "/events" },
    { label: "Pace Groups", href: "/#pace-groups" },
    { label: "Disciplines", href: "/#disciplines" },
    { label: "Recaps", href: "/recaps" },
    { label: "About", href: "/about" },
    { label: "Partners", href: "/partners" },
  ];

  const isHome = pathname === "/";
  // On home over hero when not scrolled, text is light/white; otherwise high-contrast dark
  const isOverHero = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 hidden lg:block",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3.5"
          : "bg-gradient-to-b from-club-deepNavy/80 via-club-deepNavy/30 to-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Official Club Logo */}
        <ClubLogo size="default" variant={isOverHero ? "light" : "dark"} />

        {/* Center Nav Links */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-semibold tracking-tight transition-all duration-200 hover:opacity-100 relative py-1",
                  isOverHero
                    ? "text-white/90 hover:text-white"
                    : "text-neutral-700 hover:text-club-navy",
                  isActive &&
                    (isOverHero
                      ? "text-white font-bold"
                      : "text-club-navy font-bold")
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-club-burgundy rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Utilities & Actions */}
        <div className="flex items-center gap-4">
          <a
            href={CLUB_LINKS.strava}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden xl:inline-flex items-center gap-1 text-xs font-mono uppercase tracking-telemetry transition-colors",
              isOverHero
                ? "text-white/80 hover:text-white"
                : "text-neutral-600 hover:text-club-navy"
            )}
          >
            <span>Strava Club</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <Button
            href="/join"
            variant="crimson"
            size="sm"
            className="font-bold tracking-tight shadow-sm"
          >
            Join the Club
          </Button>
        </div>
      </div>
    </header>
  );
}
