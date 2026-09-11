"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DISCIPLINES } from "@/lib/data";
import { ArrowRight, MapPin, Calendar, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function DisciplineSplit() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDiscipline = DISCIPLINES[activeIndex];

  return (
    <section id="disciplines" className="py-16 sm:py-20 bg-canvas-subtle border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            02 • Training Hub
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
            Disciplines & Focus
          </h2>
        </div>

        {/* Split Grid matching Section 3 of On.com */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Vertical List */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex flex-col space-y-2">
              {DISCIPLINES.map((disc, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={disc.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`group text-left py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-white shadow-md border-l-4 border-l-club-navy border-y border-r border-neutral-200/80"
                        : "hover:bg-neutral-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-xs tracking-telemetry font-bold transition-colors ${
                          isActive ? "text-club-navy" : "text-neutral-400 group-hover:text-neutral-600"
                        }`}
                      >
                        {disc.number}
                      </span>
                      <div>
                        <h3
                          className={`text-xl sm:text-2xl font-bold font-sans tracking-tight transition-colors ${
                            isActive ? "text-club-deepNavy" : "text-neutral-700 group-hover:text-ink"
                          }`}
                        >
                          {disc.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                          {disc.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-club-plum hidden sm:inline-block" />
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isActive
                            ? "text-club-navy translate-x-1"
                            : "text-neutral-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Media Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden bg-club-deepNavy border border-white/10 shadow-xl h-[480px] sm:h-[540px] flex flex-col justify-between p-7 sm:p-8 text-white">
              {/* Dynamic Image with Smooth Fade */}
              <div className="absolute inset-0 z-0">
                <Image
                  key={activeDiscipline.id}
                  src={activeDiscipline.image}
                  alt={activeDiscipline.title}
                  fill
                  className="object-cover transition-all duration-700 ease-spring"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-club-deepNavy/95 via-black/40 to-black/30" />
              </div>

              {/* Card Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <Badge variant="burgundy" size="sm">
                  {activeDiscipline.badge}
                </Badge>
                <span className="text-xs font-mono uppercase tracking-telemetry text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {activeDiscipline.distanceRange}
                </span>
              </div>

              {/* Card Bottom Details & Metadata */}
              <div className="relative z-10 flex flex-col gap-4">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-white">
                    {activeDiscipline.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                    {activeDiscipline.details}
                  </p>
                </div>

                {/* Inline Metadata Strip — no nested box */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-neutral-300 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-club-plum shrink-0" />
                    <span>{activeDiscipline.scheduleDay}</span>
                  </div>
                  <span className="text-white/20 hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-club-plum shrink-0" />
                    <span>{activeDiscipline.location}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    href="/events"
                    variant="crimson"
                    size="sm"
                    className="w-full sm:w-auto font-bold tracking-tight text-xs shadow-md"
                  >
                    View All {activeDiscipline.title} Sessions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
