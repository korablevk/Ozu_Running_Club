"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RunningEvent } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RSVPModal } from "./RSVPModal";
import { MapPin, Users } from "lucide-react";

interface EventCardProps {
  event: RunningEvent;
  className?: string;
  variant?: "portrait" | "horizontal";
}

export function EventCard({ event, className = "" }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const spotsLeft = event.maxParticipants - event.registeredCount;

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 text-white transition-all duration-300 hover:border-neutral-600 hover:shadow-xl ${className}`}
        style={{ minHeight: "440px" }}
      >
        {/* Background Photography with dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 30vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        </div>

        {/* Card Header Tags */}
        <div className="relative z-10 p-5 flex items-start justify-between gap-2">
          <Badge variant="volt" size="sm" pulse={event.isFeatured}>
            {event.typeLabel}
          </Badge>
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-white/90 border border-white/10 flex items-center gap-1.5">
            <Users className="w-3 h-3 text-volt" />
            <span>{spotsLeft > 0 ? `${spotsLeft} spots` : "Full"}</span>
          </div>
        </div>

        {/* Card Content & Telemetry */}
        <div className="relative z-10 p-5 pt-0 flex flex-col gap-3">
          {/* Date & Meeting point */}
          <div className="flex flex-col gap-1">
            <div className="text-xs font-mono uppercase tracking-telemetry text-volt font-bold">
              {event.displayDate} • {event.time}
            </div>
            <Link href={`/events/${event.slug}`} className="group-hover:text-volt transition-colors">
              <h3 className="text-xl font-bold font-sans tracking-tight text-white leading-tight">
                {event.title}
              </h3>
            </Link>
            <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
              {event.subtitle}
            </p>
          </div>

          {/* Meeting Point */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{event.meetingPoint}</span>
          </div>

          {/* Telemetry Row (On.com inspired monospace data) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-center font-mono">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">
                DIST
              </span>
              <span className="text-xs font-bold text-white">{event.distanceKm} KM</span>
            </div>
            <div className="border-x border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">
                PACE
              </span>
              <span className="text-xs font-bold text-volt">{event.targetPace.split("-")[0]}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">
                ELEV
              </span>
              <span className="text-xs font-bold text-white">+{event.elevationGainM}M</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="volt"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="flex-1 font-bold tracking-tight text-xs h-10"
            >
              RSVP Now
            </Button>
            <Button
              variant="outline-white"
              size="sm"
              href={`/events/${event.slug}`}
              className="px-3 text-xs h-10 border-white/30 hover:border-white"
            >
              Details
            </Button>
          </div>
        </div>
      </div>

      <RSVPModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
