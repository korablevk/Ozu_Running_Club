"use client";

import React, { useState } from "react";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { RUNNING_EVENTS } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/Badge";
import { Filter, Search, CalendarDays } from "lucide-react";

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Runs" },
    { id: "campus_social", label: "Campus Social" },
    { id: "track_interval", label: "Track & Speed" },
    { id: "city_long", label: "City Socials" },
    { id: "trail_nature", label: "Trail & Nature" },
    { id: "race_competition", label: "Race Prep" },
  ];

  const filteredEvents = RUNNING_EVENTS.filter((event) => {
    const matchesCategory =
      selectedType === "all" || event.type === selectedType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.meetingPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <main className="flex-1 pt-24 lg:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header Banner */}
          <div className="py-8 sm:py-12 border-b border-neutral-200">
            <Badge variant="burgundy" size="sm" className="mb-3">
              Official Schedule
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight text-ink">
              Runs & Sessions
            </h1>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              Every Tuesday, Thursday, and alternate weekends. 
              Certified pacers lead structured groups across all paces. Free for all Özyeğin students and faculty.
            </p>

            {/* Filter & Search Bar */}
            <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Pills (horizontal scroll on mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-6 px-6 sm:mx-0 sm:px-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedType(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-sans tracking-tight transition-all cursor-pointer ${
                      selectedType === cat.id
                        ? "bg-club-deepNavy text-white shadow-sm"
                        : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search route or meeting point..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-neutral-200 text-xs font-sans focus:outline-none focus:border-asphalt-black"
                />
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="py-10">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 p-8">
                <CalendarDays className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-asphalt-black">No runs found</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different category filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedType("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-neutral-100 text-xs font-bold text-asphalt-black hover:bg-neutral-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
