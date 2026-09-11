"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StreamItem {
  id: string;
  title: string;
  subtitle: string;
  pace: string;
  distance: string;
  image: string;
  href: string;
}

const STREAMS: StreamItem[] = [
  {
    id: "stream-campus",
    title: "Campus Loops",
    subtitle: "Conversational morning and sunset loops along Çekmeköy's perimeter trails.",
    pace: "5:45 - 6:30 /km",
    distance: "5.0 - 7.5 KM",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    href: "/events?type=campus_social",
  },
  {
    id: "stream-track",
    title: "Track & Speed",
    subtitle: "Coached 400m-1200m interval ladders, cadence drills, and lactic threshold.",
    pace: "Structured Lanes",
    distance: "6.0 - 8.0 KM",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    href: "/events?type=track_interval",
  },
  {
    id: "stream-long",
    title: "Coastlines & Trails",
    subtitle: "Caddebostan coastline socials, Belgrad Forest trails, and marathon preparation.",
    pace: "4:45 - 5:30 /km",
    distance: "10.0 - 21.1 KM",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
    href: "/events?type=city_long",
  },
];

export function PaceStreamsGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    }
  };

  return (
    <section id="pace-groups" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-semibold block mb-2">
              01 • Find Your Stride
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Running Streams
            </h2>
          </div>
          <p className="text-sm sm:text-base text-neutral-600 max-w-md">
            Whether you are running your very first kilometer or hitting a half-marathon PR, we have a dedicated pack for you.
          </p>
        </div>

        {/* Responsive Grid / Mobile Swipe Carousel with Peek Effect */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-3 gap-5 overflow-x-auto no-scrollbar touch-scroll -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
        >
          {STREAMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative flex-shrink-0 w-[82vw] sm:w-[55vw] lg:w-auto h-[480px] sm:h-[520px] rounded-2xl overflow-hidden bg-club-deepNavy border border-neutral-200/80 shadow-sm flex flex-col justify-end p-6 text-white touch-snap-item transition-transform duration-300 hover:shadow-lg hover:border-club-burgundy/40"
            >
              {/* Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
                  sizes="(max-width: 1024px) 85vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-club-deepNavy/95 via-black/40 to-transparent" />
              </div>

              {/* Card Meta & Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-telemetry text-white/90 font-bold bg-club-deepNavy/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-club-burgundy/30 self-start">
                  <span className="text-club-burgundy font-bold">{item.distance}</span>
                  <span className="text-white/40">•</span>
                  <span>{item.pace}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-club-crimson group-hover:translate-x-1.5 transition-all duration-200" />
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Scroll Progress Indicator Line (matching On.com reference) */}
        <div className="mt-6 block lg:hidden">
          <div className="w-32 h-[2px] bg-neutral-200 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-club-deepNavy transition-all duration-150 rounded-full"
              style={{
                width: "40%",
                transform: `translateX(${scrollProgress * 150}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
