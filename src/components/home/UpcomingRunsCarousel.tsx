"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import type { RunningEvent } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function UpcomingRunsCarousel({ events = [] }: { events?: RunningEvent[] }) {
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
    <section id="upcoming-runs" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header with Desktop Controls */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
              03 • Schedule & RSVP
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Upcoming Runs
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/events"
              className="text-xs uppercase font-bold tracking-wider text-neutral-700 hover:text-club-navy transition-colors flex items-center gap-1 font-sans underline underline-offset-4"
            >
              <span>View All ({events.length})</span>
            </Link>

            {/* Desktop Left/Right Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous runs"
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-club-navy hover:text-club-navy transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next runs"
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-club-navy hover:text-club-navy transition-colors"
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
          className="flex gap-6 overflow-x-auto no-scrollbar touch-scroll -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 py-2"
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-[84vw] sm:w-[360px] touch-snap-item"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* Carousel Progress Line Indicator */}
        <div className="mt-8 flex items-center justify-between">
          <div className="w-40 sm:w-56 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-club-deepNavy transition-all duration-150 rounded-full"
              style={{
                width: "35%",
                transform: `translateX(${scrollProgress * 180}%)`,
              }}
            />
          </div>

          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-sans font-medium">
            Swipe to explore runs
          </span>
        </div>
      </div>
    </section>
  );
}
