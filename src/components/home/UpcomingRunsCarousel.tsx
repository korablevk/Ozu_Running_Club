"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { RUNNING_EVENTS } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function UpcomingRunsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const cardWidth = 340;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="upcoming-runs" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header with Desktop Arrows matching On.com */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-semibold block mb-2">
              03 • Schedule & RSVP
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Upcoming Runs
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/events"
              className="text-xs font-mono uppercase font-bold tracking-telemetry text-neutral-700 hover:text-asphalt-black underline underline-offset-4"
            >
              View All ({RUNNING_EVENTS.length})
            </Link>

            {/* Desktop Left/Right Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous runs"
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-asphalt-black hover:text-asphalt-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next runs"
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-asphalt-black hover:text-asphalt-black transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper Track with Right Peek */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto no-scrollbar touch-scroll -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 py-2"
        >
          {RUNNING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-[84vw] sm:w-[360px] touch-snap-item"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* Carousel Progress Line Indicator (matching On.com reference) */}
        <div className="mt-8 flex items-center justify-between">
          <div className="w-40 sm:w-56 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-asphalt-black transition-all duration-150 rounded-full"
              style={{
                width: "35%",
                transform: `translateX(${scrollProgress * 180}%)`,
              }}
            />
          </div>

          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-telemetry">
            Swipe to explore runs
          </span>
        </div>
      </div>
    </section>
  );
}
