"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CLUB_STATS } from "@/lib/data";
import { Sparkles, ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] flex flex-col justify-between overflow-hidden bg-asphalt-black text-white">
      {/* Background Media with Subtle Parallax feel */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=2000&q=85"
          alt="ÖzÜ Running Club Athletes"
          fill
          priority
          className="object-cover object-center brightness-[0.78]"
          sizes="100vw"
        />
        {/* Subtle cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
      </div>

      {/* Top Spacer for sticky header */}
      <div className="pt-24 sm:pt-28" />

      {/* Main Hero Content (Bottom-Left Aligned matching On.com reference) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 pb-12 sm:pb-16 flex flex-col items-start">
        {/* Next Run Live Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full mb-5 transition-all hover:bg-white/15">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-volt"></span>
          </span>
          <span className="text-xs font-mono uppercase tracking-telemetry text-volt font-bold">
            Next Run: Thursday 07:30 AM
          </span>
          <span className="text-neutral-400 text-xs font-mono hidden sm:inline">
            • Çekmeköy Campus Loop
          </span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-sans tracking-tight text-white max-w-3xl leading-[1.05]">
          RUN WITH <br className="hidden sm:inline" />
          <span className="text-white">THE PACK.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-xl text-neutral-200/90 max-w-xl font-sans font-normal leading-relaxed">
          Özyeğin University’s official student running community. 
          Weekly campus loops, coached track intervals, and city miles. 
          Open to all paces. No runner left behind.
        </p>

        {/* Pill Button CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Button
            href="/#upcoming-runs"
            variant="volt"
            size="lg"
            className="w-full sm:w-auto font-extrabold text-sm sm:text-base tracking-tight"
          >
            Join Next Run
          </Button>
          <Button
            href="#pace-groups"
            variant="outline-white"
            size="lg"
            className="w-full sm:w-auto font-bold text-sm sm:text-base tracking-tight border-white/40 hover:border-white"
          >
            Explore Pace Groups
          </Button>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-6 sm:gap-10">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase">MEMBERS</span>
              <span className="text-sm sm:text-base font-bold text-white">{CLUB_STATS.activeMembers}</span>
            </div>
            <div className="border-l border-white/20 pl-6 sm:pl-10">
              <span className="text-neutral-400 block text-[10px] uppercase">WEEKLY SESSIONS</span>
              <span className="text-sm sm:text-base font-bold text-volt">{CLUB_STATS.weeklyRuns}</span>
            </div>
            <div className="border-l border-white/20 pl-6 sm:pl-10 hidden sm:block">
              <span className="text-neutral-400 block text-[10px] uppercase">DISTANCE LOGGED</span>
              <span className="text-sm sm:text-base font-bold text-white">{CLUB_STATS.kmLoggedThisSeason}</span>
            </div>
          </div>

          <a
            href="#pace-groups"
            className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <span className="uppercase text-[11px] tracking-telemetry">Scroll to explore</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
