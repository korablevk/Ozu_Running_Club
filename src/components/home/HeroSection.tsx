"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CLUB_STATS } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-end overflow-hidden bg-asphalt-black text-white">
      {/* Background Media with Subtle Brand Atmosphere Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=2000&q=85"
          alt="ÖzÜ Running Club Athletes"
          fill
          priority
          className="object-cover object-center brightness-[0.72]"
          sizes="100vw"
        />
        {/* Subtle Navy → Plum → Crimson brand atmosphere overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-club-deepNavy/85 via-club-plum/20 to-club-crimson/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-club-deepNavy via-club-deepNavy/40 to-transparent" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 pt-32 sm:pt-40 pb-12 sm:pb-16 flex flex-col items-start">
        {/* Next Run Refined Pill */}
        <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full mb-6 transition-all hover:border-club-burgundy/60 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-club-crimson opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-club-crimson" />
          </span>
          <span className="text-xs uppercase tracking-wider text-neutral-300 font-medium">
            Next Run: <strong className="text-white font-semibold">Thursday 07:30 AM</strong>
          </span>
          <span className="text-neutral-400 text-xs hidden sm:inline">
            • Çekmeköy Campus Loop
          </span>
        </div>

        {/* H1 Headline — Dominant Editorial Typography */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-display tracking-tight text-white max-w-4xl leading-[0.96]">
          WE MOVE <br />
          <span>TOGETHER.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-neutral-200/90 max-w-xl font-sans font-normal leading-relaxed">
          Özyeğin University’s official student running community. 
          Weekly campus loops, coached track intervals, and city miles. 
          Open to all paces. No runner left behind.
        </p>

        {/* Action Group: Dominant Primary CTA + Refined Text Action */}
        <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Button
            href="/#upcoming-runs"
            variant="crimson"
            size="lg"
            className="w-full sm:w-auto font-extrabold text-sm sm:text-base tracking-tight shadow-lg"
          >
            Join Next Run
          </Button>
          <Link
            href="#pace-groups"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-200 hover:text-white transition-colors py-2"
          >
            <span>Explore Pace Groups</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Streamlined Stats Line — integrated into content flow without a heavy cutting dock */}
        <div className="mt-10 sm:mt-12 flex items-center gap-6 sm:gap-10 text-xs border-t border-white/10 pt-5 text-neutral-300">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-sans">Members</span>
            <span className="text-sm font-bold text-white font-mono">{CLUB_STATS.activeMembers}</span>
          </div>
          <div className="h-5 w-px bg-white/15" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-sans">Weekly Sessions</span>
            <span className="text-sm font-bold text-white font-mono">{CLUB_STATS.weeklyRuns}</span>
          </div>
          <div className="h-5 w-px bg-white/15 hidden sm:block" />
          <div className="hidden sm:block">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-sans">Distance Logged</span>
            <span className="text-sm font-bold text-white font-mono">{CLUB_STATS.kmLoggedThisSeason}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

