"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Menu, Sparkles, UserPlus } from "lucide-react";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-3 py-2 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      >
        <Link
          href="/events"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-1 px-3 text-neutral-600 hover:text-asphalt-black transition-colors",
            pathname.startsWith("/events") && "text-asphalt-black font-bold"
          )}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-wider">Runs</span>
        </Link>

        <Link
          href="/#upcoming-runs"
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-neutral-600 hover:text-asphalt-black transition-colors relative"
        >
          <span className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-ozu-blue" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-volt" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider">Next Run</span>
        </Link>

        <Link
          href="/join"
          className={cn(
            "flex items-center gap-1.5 bg-volt text-asphalt-black px-3.5 py-1.5 rounded-pill font-bold text-xs font-sans tracking-tight hover:bg-volt-hover active:scale-95 transition-all shadow-sm",
            pathname === "/join" && "ring-2 ring-asphalt-black"
          )}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Join</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open full menu"
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-neutral-700 hover:text-asphalt-black transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-wider">Menu</span>
        </button>
      </nav>

      <MobileMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
