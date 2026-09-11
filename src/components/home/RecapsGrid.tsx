import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RECENT_RECAPS } from "@/lib/data";
import { ArrowUpRight, Navigation, Camera } from "lucide-react";

export function RecapsGrid() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-sans block mb-2">
              04 • Past Sessions & Gallery
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Recent Recaps
            </h2>
          </div>

          <Link
            href="/recaps"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-club-navy transition-colors font-sans group"
          >
            <span>Explore All Recaps</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {RECENT_RECAPS.map((recap) => (
            <article
              key={recap.id}
              className="group flex flex-col justify-between"
            >
              {/* Header: Date, Dispatch Name & Quick Stats */}
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-club-burgundy font-sans block mb-1.5">
                  {recap.date} • {recap.eventName}
                </span>
                <Link href="/recaps" className="block group/title mb-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-asphalt-black group-hover/title:text-club-navy transition-colors leading-tight">
                    {recap.title}
                  </h3>
                </Link>
                <p className="text-xs font-mono text-neutral-500 tabular-nums">
                  {recap.totalRunners} Runners · {recap.totalKm} KM Logged · {recap.avgPace} Avg
                </p>
              </div>

              {/* Photo Container */}
              <Link
                href="/recaps"
                className="block relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 mb-5 shadow-sm"
              >
                <Image
                  src={recap.coverImage}
                  alt={recap.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-sans text-white/95 font-medium flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-white/80" />
                  <span>{recap.gallery?.length || 3} Photos</span>
                </span>
              </Link>

              {/* Runner Voice & Field Note */}
              <div className="flex flex-col gap-3.5">
                <blockquote className="text-sm text-neutral-600 italic leading-relaxed border-l-2 border-club-burgundy/40 pl-3.5">
                  &ldquo;{recap.quote.text}&rdquo;
                  <footer className="text-xs not-italic text-neutral-500 mt-1.5 font-sans font-medium">
                    — {recap.quote.author}, {recap.quote.role}
                  </footer>
                </blockquote>

                {/* Footer Links */}
                <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
                  <Link
                    href="/recaps"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-club-navy hover:text-club-burgundy transition-colors font-sans"
                  >
                    <span>Read Dispatch & View Gallery</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <a
                    href={recap.stravaClubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-neutral-500 hover:text-orange-600 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-orange-500" />
                    <span>Strava Club</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

