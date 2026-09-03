import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RUNNING_EVENTS } from "@/lib/data";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, Clock, ArrowLeft, ArrowUpRight, Check, Users, Navigation } from "lucide-react";
import { EventDetailsRSVP } from "./EventDetailsRSVP";

export function generateStaticParams() {
  return RUNNING_EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const event = RUNNING_EVENTS.find((e) => e.slug === resolvedParams.slug);

  if (!event) {
    notFound();
  }

  const spotsLeft = event.maxParticipants - event.registeredCount;

  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <main className="flex-1 pt-20 lg:pt-24 pb-20">
        {/* Hero Section */}
        <div className="relative w-full h-[55vh] min-h-[420px] max-h-[600px] bg-neutral-900 text-white overflow-hidden flex flex-col justify-between">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            priority
            className="object-cover object-center brightness-[0.7]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Top Breadcrumbs */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 pt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-telemetry text-neutral-300 hover:text-volt transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Schedule</span>
            </Link>
          </div>

          {/* Hero Titles */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 pb-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="volt" size="sm">
                {event.typeLabel}
              </Badge>
              <span className="text-xs font-mono uppercase tracking-telemetry text-white/80 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {spotsLeft} Spots Left
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight text-white max-w-3xl leading-tight">
              {event.title}
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-neutral-200 max-w-xl leading-relaxed">
              {event.subtitle}
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 -mt-6 relative z-20">
          {/* Telemetry Bar Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div>
              <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                DISTANCE
              </span>
              <span className="text-xl sm:text-2xl font-bold text-asphalt-black">
                {event.distanceKm} KM
              </span>
            </div>
            <div className="border-l border-neutral-200 pl-4">
              <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                TARGET PACE
              </span>
              <span className="text-xl sm:text-2xl font-bold text-ozu-blue">
                {event.targetPace}
              </span>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-neutral-200 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                ELEVATION
              </span>
              <span className="text-xl sm:text-2xl font-bold text-asphalt-black">
                +{event.elevationGainM} M
              </span>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-neutral-200 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] uppercase tracking-telemetry text-neutral-500 block mb-1">
                DURATION
              </span>
              <span className="text-xl sm:text-2xl font-bold text-asphalt-black">
                ~{event.estimatedDurationMin} MIN
              </span>
            </div>
          </div>

          {/* Main 2-Column Split */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Details, Schedule, Pace Groups, Route (lg:span 7) */}
            <div className="lg:col-span-7 space-y-10">
              {/* Meeting Point Box */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-bold mb-3">
                  Meeting Point & Time
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-asphalt-black flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-ozu-blue shrink-0" />
                      <span>{event.meetingPoint}</span>
                    </div>
                    <div className="text-xs text-neutral-600 mt-1 font-mono">
                      {event.displayDate} • Warmup starts at {event.time}
                    </div>
                  </div>

                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-100 text-xs font-bold font-sans text-asphalt-black hover:bg-neutral-200 transition-colors shrink-0"
                  >
                    <span>Open in Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Description & Overview */}
              <div>
                <h3 className="text-2xl font-bold font-sans tracking-tight text-asphalt-black mb-3">
                  Run Overview
                </h3>
                <p className="text-base text-neutral-700 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Workout Timeline */}
              <div>
                <h3 className="text-2xl font-bold font-sans tracking-tight text-asphalt-black mb-4">
                  Session Schedule
                </h3>
                <div className="border border-neutral-200 rounded-2xl bg-white p-6 space-y-4">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="font-mono text-xs font-bold text-ozu-blue bg-neutral-100 px-2.5 py-1 rounded shrink-0">
                        {item.time}
                      </span>
                      <span className="text-sm font-semibold text-neutral-800 pt-0.5">
                        {item.activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pace Groups */}
              <div>
                <h3 className="text-2xl font-bold font-sans tracking-tight text-asphalt-black mb-4">
                  Assigned Pace Packs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.paceGroups.map((pg) => (
                    <div
                      key={pg.name}
                      className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-asphalt-black">{pg.name}</span>
                        <span className="text-xs font-mono font-bold text-volt bg-asphalt-black px-2 py-0.5 rounded">
                          {pg.pace}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-neutral-500 font-mono">
                        Pacer: <span className="text-neutral-800 font-bold">{pg.pacer}</span>
                      </div>
                      <div className="mt-1 text-xs text-emerald-600 font-medium">
                        {pg.slotsRemaining > 0 ? `${pg.slotsRemaining} spots remaining` : "Full"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Perk Box */}
              <div className="bg-asphalt-black text-white p-6 rounded-2xl border border-neutral-800 flex items-start gap-4">
                <Navigation className="w-6 h-6 text-volt shrink-0 mt-1" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-telemetry text-volt font-bold block mb-1">
                    Gear Recommendation by Runaway Zone
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    For this {event.distanceKm} KM route, we recommend lightweight road cushion trainers and breathable technical singlets. 
                    ÖzÜ members receive 20% off all gear at Runaway Zone with promo code <span className="font-bold text-white">OZU20</span>.
                  </p>
                  <a
                    href="https://runawayzone.com/tr/etkinlikler"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-volt mt-3 hover:underline"
                  >
                    <span>Explore Partner Gear</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Col: Instant Interactive RSVP Form (lg:span 5) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <EventDetailsRSVP event={event} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
