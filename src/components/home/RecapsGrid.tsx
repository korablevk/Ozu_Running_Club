import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RECENT_RECAPS } from "@/lib/data";
import { ArrowUpRight, Users, Navigation } from "lucide-react";

export function RecapsGrid() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-semibold block mb-2">
              04 • Past Sessions & Gallery
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Recent Recaps
            </h2>
          </div>

          <Link
            href="/recaps"
            className="text-xs font-mono uppercase font-bold tracking-telemetry text-neutral-700 hover:text-club-navy underline underline-offset-4 flex items-center gap-1.5"
          >
            <span>Explore All Recaps</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {RECENT_RECAPS.map((recap) => (
            <div
              key={recap.id}
              className="group relative rounded-2xl overflow-hidden bg-club-deepNavy border border-club-navy/60 flex flex-col justify-end p-6 sm:p-8 h-[440px] sm:h-[480px] text-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-club-burgundy/50"
            >
              {/* Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={recap.coverImage}
                  alt={recap.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-club-deepNavy/95 via-black/40 to-transparent" />
              </div>

              {/* Header inside card */}
              <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
                <span className="bg-club-deepNavy/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono font-medium text-white/90 border border-white/15">
                  {recap.date}
                </span>
                <a
                  href={recap.stravaClubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-club-deepNavy/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-club-burgundy transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-orange-500" />
                </a>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-3">
                <span className="text-xs font-mono uppercase tracking-telemetry text-club-burgundy font-bold">
                  {recap.eventName}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white leading-tight">
                  {recap.title}
                </h3>

                {/* Telemetry Bar */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-club-deepNavy/80 backdrop-blur-md rounded-xl border border-white/15 text-center font-mono text-xs mt-1">
                  <div>
                    <span className="text-[9px] uppercase text-neutral-400 block">RUNNERS</span>
                    <span className="font-bold text-white flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-neutral-300" />
                      {recap.totalRunners}
                    </span>
                  </div>
                  <div className="border-x border-white/10">
                    <span className="text-[9px] uppercase text-neutral-400 block">TOTAL KM</span>
                    <span className="font-bold text-white">{recap.totalKm} KM</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-neutral-400 block">AVG PACE</span>
                    <span className="font-bold text-white">{recap.avgPace}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
