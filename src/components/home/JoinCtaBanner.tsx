import React from "react";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";

export function JoinCtaBanner() {
  return (
    <section className="py-20 sm:py-28 bg-club-gradient text-white relative overflow-hidden shadow-2xl">
      {/* Subtle depth overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider text-white mb-6 border border-white/20 shadow-sm font-sans font-medium">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Membership Enrollment Open</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight text-white leading-[1.05]">
            READY TO TAKE <br />
            YOUR FIRST STRIDE?
          </h2>

          <p className="mt-6 text-base sm:text-xl text-white/90 leading-relaxed max-w-xl">
            Join 340+ Özyeğin University runners. Free membership, organized weekly pace packs, 
            exclusive partner discounts from Runaway Zone, and shared race journeys.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-sans text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-white shrink-0" />
              <span>100% Free For Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-white shrink-0" />
              <span>All Fitness Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-white shrink-0" />
              <span>20% Gear Discount</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              href="/join"
              variant="white"
              size="lg"
              className="font-extrabold text-sm sm:text-base tracking-tight shadow-xl"
            >
              Apply to Join the Club
            </Button>

            <Button
              href="/events"
              variant="outline-white"
              size="lg"
              className="font-bold text-sm sm:text-base tracking-tight border-white/40 hover:bg-white/10"
            >
              View Upcoming Runs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
