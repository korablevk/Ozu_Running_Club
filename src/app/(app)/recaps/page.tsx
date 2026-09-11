import React from "react";
import Image from "next/image";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { RECENT_RECAPS } from "@/lib/data";
import { Navigation, Users, ArrowUpRight, Award, Flame } from "lucide-react";

export default function RecapsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="py-8 sm:py-12 border-b border-neutral-200">
            <Badge variant="burgundy" size="sm" className="mb-3">
              Archives & Results
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Recaps & Gallery
            </h1>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              Every kilometer tells a story. Browse past campus loops, track sessions, and race day results with photos and telemetry from our Strava club.
            </p>

            {/* Lifetime Stats Counter */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center font-mono">
              <div>
                <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                  OFFICIAL RUNS
                </span>
                <span className="text-2xl font-bold text-asphalt-black">48</span>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                  TOTAL FINISHERS
                </span>
                <span className="text-2xl font-bold text-club-navy">1,240+</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-neutral-200 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                  TOTAL KM LOGGED
                </span>
                <span className="text-2xl font-bold text-asphalt-black">18,420 KM</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-neutral-200 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                  HALF/MARATHON PODIUMS
                </span>
                <span className="text-2xl font-bold text-white bg-club-burgundy px-2.5 py-0.5 rounded inline-block">
                  12
                </span>
              </div>
            </div>
          </div>

          {/* Recaps List */}
          <div className="py-12 space-y-16">
            {RECENT_RECAPS.map((recap, index) => (
              <div
                key={recap.id}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-lg"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-telemetry text-white bg-club-burgundy px-2.5 py-1 rounded font-bold">
                      {recap.eventName}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-asphalt-black mt-2">
                      {recap.title}
                    </h2>
                    <span className="text-xs font-mono text-neutral-500 block mt-1">
                      {recap.date} • Istanbul, TR
                    </span>
                  </div>

                  <a
                    href={recap.stravaClubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors self-start sm:self-auto border border-orange-200"
                  >
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span>View on Strava Club</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Telemetry Bar */}
                <div className="grid grid-cols-3 gap-3 my-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 block">TOTAL RUNNERS</span>
                    <span className="text-lg sm:text-xl font-bold text-asphalt-black flex items-center justify-center gap-1 mt-0.5">
                      <Users className="w-4 h-4 text-club-navy" />
                      {recap.totalRunners}
                    </span>
                  </div>
                  <div className="border-x border-neutral-200">
                    <span className="text-[10px] uppercase text-neutral-500 block">TOTAL DISTANCE</span>
                    <span className="text-lg sm:text-xl font-bold text-asphalt-black mt-0.5 block">
                      {recap.totalKm} KM
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 block">AVERAGE PACE</span>
                    <span className="text-lg sm:text-xl font-bold text-emerald-600 mt-0.5 block">
                      {recap.avgPace}
                    </span>
                  </div>
                </div>

                {/* Photo Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                  {recap.gallery.map((photo, i) => (
                    <div
                      key={i}
                      className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm group"
                    >
                      <Image
                        src={photo}
                        alt={`${recap.title} Photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  ))}
                </div>

                {/* Quote block */}
                <blockquote className="bg-neutral-50 p-6 rounded-2xl border-l-4 border-club-burgundy text-neutral-700 italic text-sm leading-relaxed mt-4">
                  &ldquo;{recap.quote.text}&rdquo;
                  <div className="mt-2 text-xs font-mono uppercase tracking-wider not-italic text-neutral-500 font-bold">
                    — {recap.quote.author}, {recap.quote.role}
                  </div>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
