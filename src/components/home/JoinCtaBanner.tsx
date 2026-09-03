import React from "react";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";

export function JoinCtaBanner() {
  return (
    <section className="py-20 sm:py-28 bg-asphalt-black text-white relative overflow-hidden">
      {/* Decorative Volt glow accent */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-volt/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-telemetry text-volt mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membership Enrollment Open</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight leading-[1.05]">
            READY TO TAKE <br />
            YOUR FIRST STRIDE?
          </h2>

          <p className="mt-6 text-base sm:text-xl text-neutral-300 leading-relaxed max-w-xl">
            Join 340+ Özyeğin University runners. Free membership, organized weekly pace packs, 
            exclusive partner discounts from Runaway Zone, and shared race journeys.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-volt shrink-0" />
              <span>100% Free For Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-volt shrink-0" />
              <span>All Fitness Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-volt shrink-0" />
              <span>20% Gear Discount</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              href="/join"
              variant="volt"
              size="lg"
              className="font-extrabold text-sm sm:text-base tracking-tight shadow-lg"
            >
              Apply to Join the Club
            </Button>

            <Button
              href="/events"
              variant="outline-white"
              size="lg"
              className="font-bold text-sm sm:text-base tracking-tight border-white/30 hover:border-white"
            >
              View Upcoming Runs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
