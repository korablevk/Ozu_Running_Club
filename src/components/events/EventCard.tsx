"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RunningEvent } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RSVPModal } from "./RSVPModal";
import { MapPin, Users, ArrowRight } from "lucide-react";

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
        className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-club-deepNavy border border-white/10 text-white transition-all duration-300 hover:border-club-burgundy/60 hover:shadow-2xl ${className}`}
        style={{ minHeight: "440px" }}
      >
        {/* Background Photography with smooth dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 30vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-club-deepNavy via-club-deepNavy/70 to-black/30" />
        </div>

        {/* Card Header: Type Badge & Spots Indicator */}
        <div className="relative z-10 p-6 flex items-start justify-between gap-2">
          <Badge variant={event.isFeatured ? "burgundy" : "navy"} size="sm" pulse={event.isFeatured}>
            {event.typeLabel}
          </Badge>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white/90 border border-white/15 flex items-center gap-1.5">
            <Users className="w-3 h-3 text-neutral-300" />
            <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</span>
          </div>
        </div>

        {/* Card Content: Date, Title, Location & RSVP Action */}
        <div className="relative z-10 p-6 flex flex-col gap-3">
          {/* Date & Time */}
          <div className="text-xs uppercase tracking-wider text-club-crimson font-bold font-mono">
            {event.displayDate} • {event.time}
          </div>

          {/* Event Title */}
          <Link href={`/events/${event.slug}`} className="group/title block">
            <h3 className="text-2xl font-black font-sans tracking-tight text-white leading-tight group-hover/title:text-neutral-200 transition-colors">
              {event.title}
            </h3>
          </Link>

          {/* Meeting Point */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{event.meetingPoint}</span>
          </div>

          {/* Card Footer: High-contrast RSVP CTA */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <Button
              variant="crimson"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex-1 font-bold tracking-tight text-xs h-10 shadow-md flex items-center justify-center gap-1.5"
            >
              <span>RSVP for Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline-white"
              size="sm"
              href={`/events/${event.slug}`}
              className="text-xs h-10 border-white/20 hover:border-white text-neutral-300 hover:text-white px-3.5"
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

